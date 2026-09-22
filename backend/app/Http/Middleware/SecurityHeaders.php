<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Headers for every API response. JSON is never cached, because admin
 * responses contain customers' personal details.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'same-origin');
        $response->headers->set('X-Robots-Tag', 'noindex, nofollow');

        if ($response instanceof JsonResponse) {
            $response->headers->set('Cache-Control', 'no-store, private');
        }

        return $response;
    }
}
