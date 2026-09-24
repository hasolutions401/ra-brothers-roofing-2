<?php

namespace App\Notifications;

use App\Enums\FormType;
use App\Models\Submission;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Confirmation to the customer that their request arrived, if
 * LEAD_CONFIRM_CUSTOMER is on and they gave an email address. Deliberately
 * short, with nothing they did not type themselves apart from our promise.
 */
class RequestReceived extends Notification
{
    public function __construct(public Submission $submission) {}

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $s = $this->submission;
        $first = strtok(trim($s->name), ' ') ?: $s->name;
        $kind = $s->form_type === FormType::Estimate ? 'estimate request' : 'request';

        $message = (new MailMessage)
            ->subject('We received your '.$kind.' – '.config('app.name'))
            ->greeting('Thank you, '.NewSubmission::text($first).'.')
            ->line("Your {$kind} reached us through our website. We call you back within one business day on ".NewSubmission::text($s->phone).'.');

        foreach (['Service' => $s->service, 'Town' => $s->town] as $label => $value) {
            if (filled($value)) {
                $message->line("**{$label}:** ".NewSubmission::text($value));
            }
        }

        return $message
            ->line('You do not need to do anything else. If you did not send this request, you can ignore this email.')
            ->salutation('– '.config('app.name'));
    }
}
