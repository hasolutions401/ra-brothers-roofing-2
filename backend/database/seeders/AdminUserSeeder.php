<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Creates the dashboard admin from ADMIN_NAME, ADMIN_EMAIL and
 * ADMIN_PASSWORD in .env, or updates that account's name and password if it
 * already exists (so running it again also resets the password).
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        ['name' => $name, 'email' => $email, 'password' => $password] = config('leads.admin');

        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('Set ADMIN_EMAIL in .env to the admin\'s email address.');
        }

        if (strlen((string) $password) < 12) {
            throw new RuntimeException('Set ADMIN_PASSWORD in .env to at least 12 characters.');
        }

        $user = User::updateOrCreate(
            ['email' => strtolower($email)],
            ['name' => $name ?: 'Admin', 'password' => $password],
        );

        $this->command?->info(($user->wasRecentlyCreated ? 'Created' : 'Updated')." admin account {$user->email}.");
    }
}
