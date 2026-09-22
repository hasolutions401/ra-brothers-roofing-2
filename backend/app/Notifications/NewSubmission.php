<?php

namespace App\Notifications;

use App\Enums\FormType;
use App\Models\Submission;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Email to the business for each new lead, if LEAD_NOTIFY_EMAIL is set.
 * Contains the essentials and a link to the full record in the dashboard.
 */
class NewSubmission extends Notification
{
    public function __construct(public Submission $submission)
    {
    }

    /** @return array<int, string> */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $s = $this->submission;
        $kind = $s->form_type === FormType::Estimate ? 'Estimate request' : 'Quick request';

        $message = (new MailMessage)
            ->subject("{$kind}: {$s->name}".($s->town ? " ({$s->town})" : ''))
            ->greeting("New {$kind} from the website")
            ->line('**Name:** '.self::text($s->name))
            ->line('**Phone:** '.self::text($s->phone));

        foreach (['Email' => $s->email, 'Town' => $s->town, 'Address' => $s->address, 'Service' => $s->service] as $label => $value) {
            if (filled($value)) {
                $message->line("**{$label}:** ".self::text($value));
            }
        }

        if ($s->details) {
            $message->line('**Best time to call:** '.self::text($s->details['best_time']));
        }

        if (filled($s->message)) {
            $message->line('**Notes:** '.self::text($s->message));
        }

        $photos = $s->photos()->count();

        return $message
            ->when($photos > 0, fn (MailMessage $m) => $m->line("**Photos:** {$photos} attached (view them in the dashboard)"))
            ->action('Open in dashboard', config('leads.frontend_url').'/admin/?id='.$s->getKey())
            ->salutation('Sent automatically by the website.');
    }

    /**
     * Visitor-typed text, with Markdown syntax escaped so that it cannot
     * become links or formatting in the email. Blade escapes the HTML.
     */
    private static function text(string $value): string
    {
        return preg_replace('/([\\\\`*_{}\[\]()#+\-.!|<>~])/', '\\\\$1', $value);
    }
}
