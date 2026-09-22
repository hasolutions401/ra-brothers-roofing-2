<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\SubmissionController as AdminSubmissionController;
use App\Http\Controllers\Admin\SubmissionPhotoController;
use App\Http\Controllers\HealthController;
use App\Http\Controllers\SetupController;
use App\Http\Controllers\SubmissionController;
use App\Http\Middleware\RejectSpam;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
 * Everything here is served under /api. Sanctum's CSRF cookie route lives at
 * /api/sanctum/csrf-cookie (see config/sanctum.php).
 */

Route::get('health', HealthController::class);

// Public website forms. Rate limit first, then the bot filters, then validation.
Route::post('submissions', [SubmissionController::class, 'store'])
    ->middleware(['throttle:submissions', RejectSpam::class]);

// One-time database setup for hosts without SSH. 404 unless SETUP_TOKEN is set.
Route::get('setup', [SetupController::class, 'show'])->middleware('throttle:setup');
Route::post('setup', [SetupController::class, 'run'])->middleware('throttle:setup');

// Dashboard: session cookie + CSRF for requests coming from the site itself.
Route::prefix('admin')->middleware(EnsureFrontendRequestsAreStateful::class)->group(function () {
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::get('stats', StatsController::class);

        Route::get('submissions/export', [AdminSubmissionController::class, 'export']);
        Route::get('submissions', [AdminSubmissionController::class, 'index']);
        Route::get('submissions/{submission}', [AdminSubmissionController::class, 'show']);
        Route::patch('submissions/{submission}', [AdminSubmissionController::class, 'update']);
        Route::delete('submissions/{submission}', [AdminSubmissionController::class, 'destroy']);
        Route::get('submissions/{submission}/photos/{photo}', [SubmissionPhotoController::class, 'show'])->scopeBindings();
    });
});
