<?php

namespace Database\Seeders;

use App\Models\Submission;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Fake leads for trying out the dashboard locally. Refuses to run in
 * production so it can never mix invented people into real data.
 */
class DemoSubmissionSeeder extends Seeder
{
    public function run(): void
    {
        if (app()->isProduction()) {
            throw new RuntimeException('DemoSubmissionSeeder only runs outside production.');
        }

        Submission::factory()->count(20)->quick()->create();
        Submission::factory()->count(40)->estimate()->create();

        $this->command?->info('Created 60 sample submissions.');
    }
}
