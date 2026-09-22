<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

/**
 * Cheap bot filters for the public forms, applied before validation:
 *
 * - a honeypot field that is hidden from people, so only bots fill it in;
 * - how long the form was open, measured by the page itself. The website
 *   always sends it; scripts posting straight to the API usually do not.
 *
 * Bots get the same success response a person would, so they have no reason
 * to adapt, and nothing is stored.
 */
class RejectSpam
{
    public const HONEYPOT = 'hp_extra_info';

    public function handle(Request $request, Closure $next): Response
    {
        $reason = match (true) {
            filled($request->input(self::HONEYPOT)) => 'honeypot',
            ! is_numeric($request->input('elapsed_ms')) => 'no timing',
            (int) $request->input('elapsed_ms') < config('leads.min_fill_seconds') * 1000 => 'too fast',
            default => null,
        };

        if ($reason === null) {
            return $next($request);
        }

        Log::info('Discarded a likely spam submission', ['reason' => $reason, 'ip' => $request->ip()]);

        return response()->json(['message' => 'Thank you. Your request has been received.'], 201);
    }
}
