<?php

/*
 * Which reverse proxies may tell Laravel the visitor's real IP address
 * (X-Forwarded-For). The IP is used for rate limiting and stored with each
 * submission, so it must be right: behind an untrusted proxy every visitor
 * would share the proxy's address and one rate limit.
 *
 * TRUSTED_PROXIES is a comma-separated list of IPs/CIDR ranges, where the
 * word "cloudflare" expands to Cloudflare's published ranges. Trusting
 * Cloudflare is harmless when a site is not behind it, because no request
 * then arrives from those addresses. "*" trusts every caller; only use it
 * when the server cannot be reached except through the proxy.
 */

$cloudflare = [
    // https://www.cloudflare.com/ips-v4
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
    '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
    '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    // https://www.cloudflare.com/ips-v6
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32',
    '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
];

$setting = trim((string) env('TRUSTED_PROXIES', 'cloudflare'));

if ($setting === '' || $setting === '*' || $setting === '**') {
    $proxies = $setting === '' ? null : $setting;
} else {
    $proxies = collect(explode(',', $setting))
        ->map(fn (string $entry) => trim($entry))
        ->filter()
        ->flatMap(fn (string $entry) => strtolower($entry) === 'cloudflare' ? $cloudflare : [$entry])
        ->values()
        ->all();
}

return [
    'proxies' => $proxies,
];
