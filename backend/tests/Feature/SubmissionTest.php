<?php

namespace Tests\Feature;

use App\Models\Submission;
use App\Notifications\NewSubmission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Notifications\AnonymousNotifiable;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_quick_form_submission_is_stored(): void
    {
        $this->postJson('/api/submissions', $this->quickPayload(), ['User-Agent' => 'TestBrowser/1.0'])
            ->assertCreated()
            ->assertJson(['message' => 'Thank you. Your request has been received.'])
            ->assertJsonMissingPath('id');

        $submission = Submission::sole();
        $this->assertSame('quick', $submission->form_type->value);
        $this->assertSame('new', $submission->status->value);
        $this->assertSame('Pat Lee', $submission->name);
        $this->assertSame('(603) 555-0142', $submission->phone);
        $this->assertSame('6035550142', $submission->phone_digits);
        $this->assertSame('Roof repair or leak', $submission->service);
        $this->assertSame('/', $submission->source_page);
        $this->assertSame('127.0.0.1', $submission->ip_address);
        $this->assertSame('TestBrowser/1.0', $submission->user_agent);
        $this->assertNull($submission->details);
    }

    public function test_quick_form_accepts_just_name_and_phone(): void
    {
        $this->postJson('/api/submissions', $this->quickPayload(['town' => '', 'service' => '']))->assertCreated();

        $this->assertNull(Submission::sole()->service);
    }

    public function test_estimate_submission_stores_details_and_photos(): void
    {
        Storage::fake('local');

        $this->post('/api/submissions', $this->estimatePayload([
            'photos' => [
                UploadedFile::fake()->image('front.jpg', 3000, 2000),
                UploadedFile::fake()->image('valley.png', 800, 600),
            ],
        ]), ['Accept' => 'application/json'])->assertCreated();

        $submission = Submission::with('photos')->sole();
        $this->assertSame('estimate', $submission->form_type->value);
        $this->assertSame('jordan@example.com', $submission->email);
        $this->assertSame('Windham, NH', $submission->town);
        $this->assertSame("Leak over the kitchen.\nDog in the yard.", $submission->message);
        $this->assertSame([
            'property_type' => 'Residential',
            'roof_age' => '15 – 20 years',
            'conditions' => ['Active leak or water stain', 'Ice dams in winter'],
            'insurance' => 'Not sure yet',
            'estimate_type' => 'Remote, from photos (fastest)',
            'best_time' => 'Morning',
        ], $submission->details);

        $this->assertCount(2, $submission->photos);
        $photo = $submission->photos->first();
        $this->assertSame('front.jpg', $photo->original_name);
        $this->assertSame('image/jpeg', $photo->mime_type);
        $this->assertStringStartsWith("submissions/{$submission->id}/", $photo->path);
        Storage::disk('local')->assertExists($photo->path);

        // Re-encoded by the server and scaled to the configured maximum.
        [$width, $height] = getimagesizefromstring(Storage::disk('local')->get($photo->path));
        $this->assertSame([1600, 1067], [$width, $height]);
        $this->assertSame('image/jpeg', $submission->photos->last()->mime_type);
    }

    public function test_missing_fields_return_the_forms_own_messages(): void
    {
        $this->postJson('/api/submissions', ['form_type' => 'estimate', 'elapsed_ms' => 9000])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'service' => 'Choose the service closest to what you need.',
                'roof_age' => 'Pick a rough age, or “Not sure”.',
                'town' => 'Choose your town, or “My town is not on this list”.',
                'name' => 'Please add your name.',
                'phone' => 'Please add a phone number we can call back.',
            ]);

        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_phone_and_email_are_checked(): void
    {
        $this->postJson('/api/submissions', $this->estimatePayload(['phone' => '555-0142', 'email' => 'jordan@']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'phone' => 'Please add a phone number we can call back.',
                'email' => 'That email address does not look complete.',
            ]);
    }

    public function test_choices_must_come_from_the_allowed_lists(): void
    {
        $this->postJson('/api/submissions', $this->estimatePayload([
            'roof_age' => '100 years',
            'conditions' => ['Aliens'],
            'service' => 'Plumbing',
        ]))->assertUnprocessable()->assertJsonValidationErrors(['roof_age', 'conditions.0', 'service']);

        $this->postJson('/api/submissions', $this->quickPayload(['service' => 'Roof Repair', 'form_type' => 'newsletter']))
            ->assertUnprocessable()->assertJsonValidationErrors(['form_type']);
    }

    public function test_quick_form_cannot_attach_photos(): void
    {
        $this->post('/api/submissions', $this->quickPayload([
            'photos' => [UploadedFile::fake()->image('a.jpg')],
        ]), ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors('photos');
    }

    public function test_only_images_are_accepted_as_photos(): void
    {
        $this->post('/api/submissions', $this->estimatePayload([
            'photos' => [UploadedFile::fake()->create('invoice.pdf', 20, 'application/pdf')],
        ]), ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['photos.0' => 'Photos must be JPG, PNG or WebP images.']);

        $this->post('/api/submissions', $this->estimatePayload([
            'photos' => array_fill(0, 9, UploadedFile::fake()->image('a.jpg')),
        ]), ['Accept' => 'application/json'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['photos' => 'You can attach up to 8 photos.']);
    }

    public function test_text_is_cleaned_but_not_rewritten(): void
    {
        $this->postJson('/api/submissions', $this->estimatePayload([
            'name' => "  Pat\u{200B}\n  O'Neil\x07 ",
            'address' => '12 <Main> St',
            'notes' => "Roof < 10 years?\r\n\r\n\r\n\r\nCall first.\x00",
            'source_page' => 'javascript:alert(1)',
        ]))->assertCreated();

        $submission = Submission::sole();
        $this->assertSame("Pat O'Neil", $submission->name);
        $this->assertSame('12 <Main> St', $submission->address);
        $this->assertSame("Roof < 10 years?\n\nCall first.", $submission->message);
        $this->assertNull($submission->source_page);
    }

    public function test_honeypot_submissions_look_accepted_but_are_not_stored(): void
    {
        $this->postJson('/api/submissions', $this->quickPayload(['hp_extra_info' => 'https://spam.example']))
            ->assertCreated();

        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_instant_or_untimed_submissions_are_discarded(): void
    {
        $this->postJson('/api/submissions', $this->quickPayload(['elapsed_ms' => 900]))->assertCreated();
        $this->postJson('/api/submissions', array_diff_key($this->quickPayload(), ['elapsed_ms' => true]))->assertCreated();

        $this->assertDatabaseCount('submissions', 0);
    }

    public function test_submissions_are_rate_limited_per_ip(): void
    {
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/submissions', $this->quickPayload())->assertCreated();
        }

        $this->postJson('/api/submissions', $this->quickPayload())
            ->assertTooManyRequests()
            ->assertJson(['message' => 'Too many requests from your connection. Please wait a few minutes and try again.'])
            ->assertHeader('Retry-After');

        // Another visitor is unaffected.
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.7'])
            ->postJson('/api/submissions', $this->quickPayload())->assertCreated();

        $this->assertDatabaseCount('submissions', 6);
    }

    public function test_visitor_ip_is_read_through_cloudflare_only(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '162.158.10.20'])
            ->withHeader('X-Forwarded-For', '203.0.113.50')
            ->postJson('/api/submissions', $this->quickPayload())->assertCreated();

        // A forged header from anywhere else is ignored.
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.9'])
            ->withHeader('X-Forwarded-For', '203.0.113.99')
            ->postJson('/api/submissions', $this->quickPayload())->assertCreated();

        $this->assertSame(['203.0.113.50', '198.51.100.9'], Submission::orderBy('id')->pluck('ip_address')->all());
    }

    public function test_new_lead_email_is_sent_when_configured(): void
    {
        Notification::fake();
        config(['leads.notify_email' => 'office@example.com']);

        $this->withoutDefer()->postJson('/api/submissions', $this->estimatePayload())->assertCreated();

        Notification::assertSentOnDemand(NewSubmission::class, function (NewSubmission $notification, array $channels, AnonymousNotifiable $notifiable) {
            $mail = $notification->toMail($notifiable);

            return $notifiable->routes['mail'] === 'office@example.com'
                && $mail->subject === 'Estimate request: Jordan Smith (Windham, NH)'
                && $mail->actionUrl === 'http://localhost:3000/admin/?id='.$notification->submission->id;
        });
    }

    public function test_no_email_is_sent_by_default(): void
    {
        Notification::fake();

        $this->withoutDefer()->postJson('/api/submissions', $this->quickPayload())->assertCreated();

        Notification::assertNothingSent();
    }

    public function test_a_failing_mail_server_never_loses_the_lead(): void
    {
        config([
            'leads.notify_email' => 'office@example.com',
            'mail.default' => 'smtp',
            'mail.mailers.smtp.host' => '127.0.0.1',
            'mail.mailers.smtp.port' => 1,
        ]);

        $this->withoutDefer()->postJson('/api/submissions', $this->quickPayload())->assertCreated();

        $this->assertDatabaseCount('submissions', 1);
    }

    public function test_markdown_in_visitor_text_cannot_become_links_in_the_email(): void
    {
        $submission = Submission::factory()->create(['name' => '[Click here](https://evil.example)']);

        $html = (string) (new NewSubmission($submission))->toMail(new AnonymousNotifiable)->render();

        $this->assertStringNotContainsString('href="https://evil.example"', $html);
        $this->assertStringContainsString('Click here', $html);
    }
}
