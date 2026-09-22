<?php

/*
 * Cross-origin requests only happen in local development, where the Next.js
 * dev server (localhost:3000) calls the API (localhost:8000). In production
 * the site and the API share one domain, so browsers never need CORS.
 * Credentials are allowed so the admin session cookie is sent.
 */

$origins = collect(explode(',', (string) env('FRONTEND_URL', env('APP_URL', 'http://localhost'))))
    ->map(function (string $url) {
        $parts = parse_url(trim($url));

        return isset($parts['scheme'], $parts['host'])
            ? $parts['scheme'].'://'.$parts['host'].(isset($parts['port']) ? ':'.$parts['port'] : '')
            : null;
    })
    ->filter()
    ->unique()
    ->values()
    ->all();

return [

    'paths' => ['api/*'],

    'allowed_methods' => ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => $origins,

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Accept', 'Content-Type', 'X-Requested-With', 'X-XSRF-TOKEN'],

    'exposed_headers' => ['Content-Disposition', 'Retry-After'],

    'max_age' => 600,

    'supports_credentials' => true,

];
