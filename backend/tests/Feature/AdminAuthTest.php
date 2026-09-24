<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_csrf_cookie_is_issued_under_the_api_path(): void
    {
        $this->fromSite()->get('/api/sanctum/csrf-cookie')
            ->assertNoContent()
            ->assertCookie('XSRF-TOKEN');
    }

    public function test_admin_can_sign_in_check_the_session_and_sign_out(): void
    {
        $user = User::factory()->create(['email' => 'owner@example.com', 'password' => 'a-long-test-password']);

        $this->fromSite()->postJson('/api/admin/login', ['email' => 'OWNER@example.com', 'password' => 'a-long-test-password'])
            ->assertOk()
            ->assertExactJson(['user' => ['id' => $user->id, 'name' => $user->name, 'email' => 'owner@example.com']]);

        $this->assertAuthenticatedAs($user, 'web');
        $this->assertNotNull($user->fresh()->last_login_at);

        $this->fromSite()->getJson('/api/admin/me')->assertOk()->assertJsonPath('user.email', 'owner@example.com');

        $this->fromSite()->postJson('/api/admin/logout')->assertNoContent();
        $this->assertGuest('web');

        Auth::forgetGuards();
        $this->fromSite()->getJson('/api/admin/me')->assertUnauthorized();
    }

    public function test_wrong_password_is_rejected_without_saying_which_part_was_wrong(): void
    {
        User::factory()->create(['email' => 'owner@example.com']);

        $this->fromSite()->postJson('/api/admin/login', ['email' => 'owner@example.com', 'password' => 'nope'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['email' => 'That email and password do not match an admin account.']);

        $this->fromSite()->postJson('/api/admin/login', ['email' => 'nobody@example.com', 'password' => 'nope'])
            ->assertJsonValidationErrors(['email' => 'That email and password do not match an admin account.']);

        $this->assertGuest('web');
    }

    public function test_sign_in_only_works_from_the_site(): void
    {
        User::factory()->create(['email' => 'owner@example.com', 'password' => 'a-long-test-password']);

        $this->withHeader('Referer', 'https://evil.example/')
            ->postJson('/api/admin/login', ['email' => 'owner@example.com', 'password' => 'a-long-test-password'])
            ->assertForbidden();

        $this->assertGuest('web');
    }

    public function test_sign_in_attempts_are_rate_limited(): void
    {
        User::factory()->create(['email' => 'owner@example.com']);

        for ($i = 0; $i < 5; $i++) {
            $this->fromSite()->postJson('/api/admin/login', ['email' => 'owner@example.com', 'password' => "guess-$i"])
                ->assertUnprocessable();
        }

        $this->fromSite()->postJson('/api/admin/login', ['email' => 'owner@example.com', 'password' => 'correct horse battery'])
            ->assertTooManyRequests()
            ->assertJson(['message' => 'Too many sign-in attempts. Wait a minute and try again.']);
    }

    public function test_every_admin_endpoint_requires_a_signed_in_admin(): void
    {
        $endpoints = [
            ['post', '/api/admin/logout'],
            ['get', '/api/admin/me'],
            ['get', '/api/admin/stats'],
            ['get', '/api/admin/submissions'],
            ['get', '/api/admin/submissions/export'],
            ['get', '/api/admin/submissions/1'],
            ['patch', '/api/admin/submissions/1'],
            ['delete', '/api/admin/submissions/1'],
            ['get', '/api/admin/submissions/1/photos/1'],
        ];

        foreach ($endpoints as [$method, $uri]) {
            $this->fromSite()->json($method, $uri)->assertUnauthorized();
            // And with no Referer, as a script would call it.
            $this->json($method, $uri)->assertUnauthorized();
        }
    }

    public function test_api_responses_carry_security_headers(): void
    {
        $this->fromSite()->getJson('/api/admin/me')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY')
            ->assertHeader('X-Robots-Tag', 'noindex, nofollow')
            ->assertHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'")
            ->assertHeader('Permissions-Policy', 'camera=(), geolocation=(), microphone=(), payment=()');

        $this->assertStringContainsString('no-store', $this->signedIn()->getJson('/api/admin/stats')->headers->get('Cache-Control'));
    }
}
