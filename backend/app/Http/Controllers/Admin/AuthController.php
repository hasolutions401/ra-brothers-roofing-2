<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

/**
 * Sanctum SPA authentication: the dashboard signs in with a session cookie
 * (httpOnly, SameSite=Lax) plus Laravel's CSRF token, never a token that
 * JavaScript can read. The dashboard fetches /api/sanctum/csrf-cookie first.
 */
class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        // Sessions only start for requests from the site itself (Referer or
        // Origin in SANCTUM_STATEFUL_DOMAINS).
        abort_unless($request->hasSession(), 403, 'Sign in from the website’s admin page.');

        if (! Auth::guard('web')->attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => 'That email and password do not match an admin account.',
            ]);
        }

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::guard('web')->user();
        $user->forceFill(['last_login_at' => now()])->save();

        return response()->json(['user' => $this->present($user)]);
    }

    public function logout(Request $request): Response
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->present($request->user())]);
    }

    /** @return array{id: int, name: string, email: string} */
    private function present(User $user): array
    {
        return ['id' => $user->id, 'name' => $user->name, 'email' => $user->email];
    }
}
