<?php

namespace App\Http\Controllers;

use Database\Seeders\AdminUserSeeder;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Throwable;

/**
 * One-time setup from the browser, for hosts without SSH (InfinityFree):
 * runs the migrations and creates the admin account from .env.
 *
 * Off unless SETUP_TOKEN is set to 32+ characters, and it switches itself
 * off after a successful run by writing storage/app/setup.lock. To run it
 * again (for example after a later release adds a migration), delete that
 * file. Requests to it are rate limited. Remove SETUP_TOKEN when finished.
 */
class SetupController extends Controller
{
    public function show(): Response
    {
        $this->ensureAvailable();

        return response()->view('setup', ['result' => null]);
    }

    public function run(Request $request): Response
    {
        $this->ensureAvailable();

        if (! hash_equals((string) config('leads.setup_token'), (string) $request->input('token'))) {
            return response()->view('setup', ['result' => null, 'error' => 'That setup token is not correct.'], 403);
        }

        try {
            Artisan::call('migrate', ['--force' => true]);
            $output = Artisan::output();
            Artisan::call('db:seed', ['--class' => AdminUserSeeder::class, '--force' => true]);
            $output .= Artisan::output();
        } catch (Throwable $e) {
            report($e);

            return response()->view('setup', [
                'result' => null,
                'error' => 'Setup failed: '.$e->getMessage(),
            ], 500);
        }

        File::put(self::lockFile(), now()->toIso8601String().PHP_EOL);

        return response()->view('setup', ['result' => trim($output)]);
    }

    private function ensureAvailable(): void
    {
        abort_if(strlen((string) config('leads.setup_token')) < 32 || File::exists(self::lockFile()), 404);
    }

    public static function lockFile(): string
    {
        return storage_path('app/setup.lock');
    }
}
