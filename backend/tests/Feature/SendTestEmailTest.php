<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class SendTestEmailTest extends TestCase
{
    public function test_it_needs_an_address(): void
    {
        config(['leads.notify_email' => null]);

        $this->artisan('leads:test-email')->assertFailed();
    }

    public function test_it_warns_that_the_log_mailer_sends_nothing(): void
    {
        config(['mail.default' => 'log']);

        $this->artisan('leads:test-email', ['to' => 'office@example.com'])
            ->expectsOutputToContain('nothing was actually sent')
            ->assertFailed();
    }

    public function test_it_reports_a_mail_server_failure(): void
    {
        config([
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => '127.0.0.1',
            'mail.mailers.smtp.port' => 1,
        ]);

        $this->artisan('leads:test-email', ['to' => 'office@example.com'])
            ->expectsOutputToContain('Sending failed')
            ->assertFailed();
    }

    public function test_it_sends_to_the_notify_address_by_default(): void
    {
        Mail::fake();
        config(['mail.default' => 'smtp', 'leads.notify_email' => 'office@example.com']);

        $this->artisan('leads:test-email')->assertSuccessful();
    }
}
