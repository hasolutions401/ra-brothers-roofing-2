<?php

use App\Http\Middleware\SecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\PostTooLargeException;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Session\TokenMismatchException;

/*
 * API only: the website itself is the static Next.js export, and the web
 * server sends /api/* here (see deploy/).
 */
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Prepended so it wraps everything, including 401 and 429 responses
        // (Laravel moves auth and throttling ahead of unprioritised middleware).
        $middleware->api(prepend: [SecurityHeaders::class]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Friendlier wording than the framework defaults; the forms show these.
        $exceptions->render(fn (ThrottleRequestsException $e, Request $request) => response()->json([
            'message' => $request->is('api/admin/login')
                ? 'Too many sign-in attempts. Wait a minute and try again.'
                : 'Too many requests from your connection. Please wait a few minutes and try again.',
        ], 429, $e->getHeaders()));

        $exceptions->render(fn (PostTooLargeException $e) => response()->json([
            'message' => 'The photos are too large to send together. Remove some and try again.',
        ], 413));

        $exceptions->render(fn (TokenMismatchException $e) => response()->json([
            'message' => 'Your session has expired. Please sign in again.',
        ], 419));
    })->create();
