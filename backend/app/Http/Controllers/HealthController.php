<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Schema;
use Throwable;

/**
 * GET /api/health: a quick post-deploy check that PHP, Laravel and the
 * database are all reachable. It reveals nothing beyond yes or no.
 */
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            $migrated = Schema::hasTable('submissions') && Schema::hasTable('users');
            $database = 'connected';
        } catch (Throwable) {
            $migrated = false;
            $database = 'unreachable';
        }

        return response()->json([
            'status' => $database === 'connected' && $migrated ? 'ok' : 'error',
            'database' => $database,
            'migrated' => $migrated,
        ], $database === 'connected' && $migrated ? 200 : 503);
    }
}
