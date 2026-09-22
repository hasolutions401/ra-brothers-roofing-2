<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Models\Submission;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;

/**
 * The overview cards. "Today" and "this week" (Monday to Sunday) follow the
 * business's time zone; the dates are returned so the dashboard's card
 * filters use exactly the same days.
 */
class StatsController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $now = CarbonImmutable::now(config('leads.timezone'));
        $today = $now->startOfDay();
        $week = $now->startOfWeek(CarbonImmutable::MONDAY);

        return response()->json([
            'total' => Submission::count(),
            'new' => Submission::where('status', SubmissionStatus::New)->count(),
            'today' => Submission::where('created_at', '>=', $today->utc())->count(),
            'this_week' => Submission::where('created_at', '>=', $week->utc())->count(),
            'today_date' => $today->toDateString(),
            'week_start_date' => $week->toDateString(),
            'timezone' => config('leads.timezone'),
        ]);
    }
}
