<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Production-safe seeding: only the admin account. For sample leads in
     * local development, run: php artisan db:seed --class=DemoSubmissionSeeder
     */
    public function run(): void
    {
        $this->call(AdminUserSeeder::class);
    }
}
