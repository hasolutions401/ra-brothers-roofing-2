<?php

namespace Tests\Feature;

use App\Http\Controllers\SetupController;
use App\Models\User;
use Database\Seeders\AdminUserSeeder;
use Database\Seeders\DemoSubmissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\TestCase;

class SetupAndSeedingTest extends TestCase
{
    use RefreshDatabase;

    private const TOKEN = 'a-setup-token-that-is-long-enough-123';

    protected function tearDown(): void
    {
        File::delete(SetupController::lockFile());
        parent::tearDown();
    }

    public function test_admin_seeder_creates_the_account_from_env_then_resets_its_password(): void
    {
        $this->seed(AdminUserSeeder::class);

        $admin = User::sole();
        $this->assertSame('owner@example.com', $admin->email);
        $this->assertSame('Test Admin', $admin->name);
        $this->assertTrue(Hash::check('a-long-test-password', $admin->password));
        $this->assertNotSame('a-long-test-password', $admin->password);

        config(['leads.admin.password' => 'a-brand-new-password']);
        $this->seed(AdminUserSeeder::class);

        $this->assertSame(1, User::count());
        $this->assertTrue(Hash::check('a-brand-new-password', User::sole()->password));
    }

    public function test_admin_seeder_refuses_a_short_password(): void
    {
        config(['leads.admin.password' => 'short']);

        $this->expectException(RuntimeException::class);
        $this->seed(AdminUserSeeder::class);
    }

    public function test_demo_data_never_seeds_production(): void
    {
        $this->app['env'] = 'production';

        $this->expectException(RuntimeException::class);
        (new DemoSubmissionSeeder)->run();
    }

    public function test_setup_page_is_off_without_a_long_token(): void
    {
        $this->get('/api/setup')->assertNotFound();

        config(['leads.setup_token' => 'too-short']);
        $this->get('/api/setup')->assertNotFound();
        $this->post('/api/setup', ['token' => 'too-short'])->assertNotFound();
    }

    public function test_setup_runs_once_with_the_right_token(): void
    {
        config(['leads.setup_token' => self::TOKEN]);

        $this->get('/api/setup')->assertOk()->assertSee('Setup token');
        $this->post('/api/setup', ['token' => 'wrong'])->assertForbidden();
        $this->assertSame(0, User::count());

        $this->post('/api/setup', ['token' => self::TOKEN])->assertOk()->assertSee('Done.');
        $this->assertSame('owner@example.com', User::sole()->email);
        $this->assertFileExists(SetupController::lockFile());

        // Switched off after a successful run.
        $this->get('/api/setup')->assertNotFound();
        $this->post('/api/setup', ['token' => self::TOKEN])->assertNotFound();
    }

    public function test_health_check_reports_database_and_migrations(): void
    {
        $this->getJson('/api/health')->assertOk()->assertExactJson(['status' => 'ok', 'database' => 'connected', 'migrated' => true]);
    }
}
