<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Model::shouldBeStrict(! $this->app->isProduction());

        // Public forms: generous for a family sending a couple of requests,
        // tight enough that a script cannot flood the inbox.
        RateLimiter::for('submissions', fn (Request $request) => [
            Limit::perMinutes(10, 5)->by('submissions-10m:'.$request->ip()),
            Limit::perDay(20)->by('submissions-day:'.$request->ip()),
        ]);

        // Sign-in: per account and IP, plus an overall cap per IP.
        RateLimiter::for('login', fn (Request $request) => [
            Limit::perMinute(5)->by('login:'.Str::lower((string) $request->input('email')).'|'.$request->ip()),
            Limit::perMinute(20)->by('login-ip:'.$request->ip()),
        ]);

        RateLimiter::for('setup', fn (Request $request) => Limit::perMinute(5)->by('setup:'.$request->ip()));
    }
}
