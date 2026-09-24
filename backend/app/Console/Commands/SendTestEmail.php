<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Throwable;

/**
 * Proves the server can send mail before real leads depend on it: sends one
 * test message and reports the mail server's error if it fails. The
 * website swallows mail errors (a lead is never lost to a mail outage), so
 * this is the place to see them.
 *
 *   php artisan leads:test-email              (to LEAD_NOTIFY_EMAIL)
 *   php artisan leads:test-email you@example.com
 */
class SendTestEmail extends Command
{
    protected $signature = 'leads:test-email {to? : Address to send to (defaults to LEAD_NOTIFY_EMAIL)}';

    protected $description = 'Send a test email to check new-lead email delivery';

    public function handle(): int
    {
        $to = $this->argument('to') ?: config('leads.notify_email');

        if (! filter_var($to, FILTER_VALIDATE_EMAIL)) {
            $this->error('Give an address, or set LEAD_NOTIFY_EMAIL in .env.');

            return self::FAILURE;
        }

        $mailer = config('mail.default');

        try {
            Mail::raw(
                "This is a test from the website's lead system.\n\nIf you can read it, new-lead emails will reach this inbox. Check the spam folder too, and mark this message as not spam if it landed there.",
                fn (Message $message) => $message->to($to)->subject('Test: website lead emails are working'),
            );
        } catch (Throwable $e) {
            $this->error("Sending failed through the \"{$mailer}\" mailer: {$e->getMessage()}");

            return self::FAILURE;
        }

        if (in_array($mailer, ['log', 'array'], true)) {
            $this->warn("MAIL_MAILER is \"{$mailer}\", so nothing was actually sent. Set up SMTP in .env first.");

            return self::FAILURE;
        }

        $this->info("Sent to {$to} through \"{$mailer}\". Check that inbox (and its spam folder).");

        return self::SUCCESS;
    }
}
