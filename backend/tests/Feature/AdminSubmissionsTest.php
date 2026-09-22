<?php

namespace Tests\Feature;

use App\Enums\SubmissionStatus;
use App\Models\Submission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminSubmissionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_list_is_paginated_newest_first(): void
    {
        Submission::factory()->count(30)->create();
        $newest = Submission::factory()->create(['created_at' => now()->addMinute()]);

        $this->signedIn()->getJson('/api/admin/submissions?per_page=10')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('data.0.id', $newest->id)
            ->assertJsonPath('meta.total', 31)
            ->assertJsonPath('meta.last_page', 4)
            ->assertJsonStructure(['data' => [['id', 'form_type', 'form_label', 'status', 'name', 'phone', 'email', 'town', 'service', 'photos_count', 'created_at']]]);
    }

    public function test_search_matches_names_emails_towns_and_phone_digits(): void
    {
        $pat = Submission::factory()->create(['name' => 'Pat Quinlan', 'phone' => '(603) 555-0142', 'town' => 'Salem, NH']);
        Submission::factory()->create(['name' => 'Someone Else', 'phone' => '(978) 555-0100', 'town' => 'Andover, MA']);

        foreach (['quinlan', '6035550142', '555-0142', '(603) 555'] as $term) {
            $this->signedIn()->getJson('/api/admin/submissions?search='.urlencode($term))
                ->assertJsonCount(1, 'data')
                ->assertJsonPath('data.0.id', $pat->id);
        }

        $this->signedIn()->getJson('/api/admin/submissions?search=andover')->assertJsonCount(1, 'data');
    }

    public function test_filters_by_form_status_and_business_calendar_days(): void
    {
        // 23:30 in New Hampshire on 21 September is already 22 September in UTC.
        $lateEvening = Submission::factory()->estimate()->status(SubmissionStatus::New)
            ->create(['created_at' => Carbon::parse('2026-09-22 03:30:00', 'UTC')]);
        Submission::factory()->quick()->status(SubmissionStatus::New)
            ->create(['created_at' => Carbon::parse('2026-09-22 14:00:00', 'UTC')]);
        Submission::factory()->estimate()->status(SubmissionStatus::Contacted)
            ->create(['created_at' => Carbon::parse('2026-09-22 15:00:00', 'UTC')]);

        $ids = fn (string $query) => collect($this->signedIn()->getJson('/api/admin/submissions?'.$query)->assertOk()->json('data'))->pluck('id')->all();

        $this->assertSame([$lateEvening->id], $ids('from=2026-09-21&to=2026-09-21'));
        $this->assertCount(2, $ids('from=2026-09-22'));
        $this->assertCount(2, $ids('form_type=estimate'));
        $this->assertCount(2, $ids('status=new'));
        $this->assertSame([$lateEvening->id], $ids('form_type=estimate&status=new'));
    }

    public function test_sorting(): void
    {
        Submission::factory()->create(['name' => 'Bea']);
        Submission::factory()->create(['name' => 'Al']);
        Submission::factory()->create(['name' => 'Cy']);

        $names = fn (string $dir) => collect($this->signedIn()->getJson("/api/admin/submissions?sort=name&dir=$dir")->json('data'))->pluck('name')->all();

        $this->assertSame(['Al', 'Bea', 'Cy'], $names('asc'));
        $this->assertSame(['Cy', 'Bea', 'Al'], $names('desc'));
    }

    public function test_unknown_sort_columns_and_bad_dates_are_rejected(): void
    {
        $this->signedIn()->getJson('/api/admin/submissions?sort=ip_address')->assertUnprocessable()->assertJsonValidationErrors('sort');
        $this->signedIn()->getJson('/api/admin/submissions?from=2026-09-10&to=2026-09-01')->assertUnprocessable()->assertJsonValidationErrors('to');
        $this->signedIn()->getJson('/api/admin/submissions?per_page=1000')->assertUnprocessable()->assertJsonValidationErrors('per_page');
    }

    public function test_opening_a_new_submission_marks_it_read(): void
    {
        $submission = Submission::factory()->estimate()->status(SubmissionStatus::New)->create(['read_at' => null]);

        $this->signedIn()->getJson("/api/admin/submissions/{$submission->id}")
            ->assertOk()
            ->assertJsonPath('data.status', 'read')
            ->assertJsonPath('data.details.roof_age', $submission->details['roof_age'])
            ->assertJsonPath('data.photos', []);

        $this->assertNotNull($submission->fresh()->read_at);
    }

    public function test_status_changes_keep_timestamps_consistent(): void
    {
        $submission = Submission::factory()->status(SubmissionStatus::New)->create(['read_at' => null, 'contacted_at' => null]);

        $this->signedIn()->patchJson("/api/admin/submissions/{$submission->id}", ['status' => 'contacted'])
            ->assertOk()->assertJsonPath('data.status', 'contacted');
        $submission->refresh();
        $this->assertNotNull($submission->read_at);
        $this->assertNotNull($submission->contacted_at);

        $this->signedIn()->patchJson("/api/admin/submissions/{$submission->id}", ['status' => 'new'])->assertOk();
        $submission->refresh();
        $this->assertNull($submission->read_at);
        $this->assertNull($submission->contacted_at);

        $this->signedIn()->patchJson("/api/admin/submissions/{$submission->id}", ['status' => 'archived'])
            ->assertUnprocessable()->assertJsonValidationErrors('status');
    }

    public function test_delete_removes_the_submission_and_its_photo_files(): void
    {
        Storage::fake('local');
        $submission = Submission::factory()->estimate()->create();
        Storage::disk('local')->put("submissions/{$submission->id}/a.jpg", 'jpeg');
        $submission->photos()->create(['path' => "submissions/{$submission->id}/a.jpg", 'original_name' => 'a.jpg', 'mime_type' => 'image/jpeg', 'size' => 4]);

        $this->signedIn()->deleteJson("/api/admin/submissions/{$submission->id}")->assertNoContent();

        $this->assertModelMissing($submission);
        $this->assertDatabaseCount('submission_photos', 0);
        Storage::disk('local')->assertMissing("submissions/{$submission->id}/a.jpg");
        $this->signedIn()->getJson("/api/admin/submissions/{$submission->id}")->assertNotFound();
    }

    public function test_photos_are_served_only_through_their_own_submission(): void
    {
        Storage::fake('local');
        [$a, $b] = Submission::factory()->estimate()->count(2)->create();
        Storage::disk('local')->put("submissions/{$a->id}/p.jpg", 'jpeg-bytes');
        $photo = $a->photos()->create(['path' => "submissions/{$a->id}/p.jpg", 'original_name' => 'roof.jpg', 'mime_type' => 'image/jpeg', 'size' => 10]);

        $response = $this->signedIn()->get("/api/admin/submissions/{$a->id}/photos/{$photo->id}")->assertOk();
        $this->assertSame('jpeg-bytes', $response->streamedContent());
        $response->assertHeader('Content-Type', 'image/jpeg')->assertHeader('X-Content-Type-Options', 'nosniff');

        $this->signedIn()->get("/api/admin/submissions/{$b->id}/photos/{$photo->id}")->assertNotFound();
    }

    public function test_csv_export_follows_the_filters_and_neutralises_formulas(): void
    {
        Submission::factory()->estimate()->create(['name' => '=HYPERLINK("http://evil.example","Click")', 'message' => "Line one\nLine two"]);
        Submission::factory()->quick()->create(['name' => 'Quick Person']);

        $response = $this->signedIn()->get('/api/admin/submissions/export?form_type=estimate')->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $this->assertStringContainsString('attachment; filename=leads-', $response->headers->get('Content-Disposition'));

        $csv = $response->streamedContent();
        $this->assertStringStartsWith("\xEF\xBB\xBFID,Received,Form,Status,Name,Phone", $csv);
        $this->assertStringContainsString('"\'=HYPERLINK(""http://evil.example"",""Click"")"', $csv);
        $this->assertStringContainsString("\"Line one\nLine two\"", $csv);
        $this->assertStringNotContainsString('Quick Person', $csv);
    }

    public function test_stats_count_days_and_weeks_in_the_business_time_zone(): void
    {
        // Wednesday 23 September 2026, 01:00 in New Hampshire.
        $this->travelTo(Carbon::parse('2026-09-23 05:00:00', 'UTC'));

        Submission::factory()->status(SubmissionStatus::New)->create(['created_at' => Carbon::parse('2026-09-23 04:30:00', 'UTC')]); // Wed 00:30 ET
        Submission::factory()->status(SubmissionStatus::Read)->create(['created_at' => Carbon::parse('2026-09-23 03:30:00', 'UTC')]); // Tue 23:30 ET
        Submission::factory()->status(SubmissionStatus::New)->create(['created_at' => Carbon::parse('2026-09-21 05:00:00', 'UTC')]); // Mon 01:00 ET
        Submission::factory()->status(SubmissionStatus::Contacted)->create(['created_at' => Carbon::parse('2026-09-21 03:00:00', 'UTC')]); // Sun 23:00 ET

        $this->signedIn()->getJson('/api/admin/stats')->assertOk()->assertExactJson([
            'total' => 4,
            'new' => 2,
            'today' => 1,
            'this_week' => 3,
            'today_date' => '2026-09-23',
            'week_start_date' => '2026-09-21',
            'timezone' => 'America/New_York',
        ]);
    }
}
