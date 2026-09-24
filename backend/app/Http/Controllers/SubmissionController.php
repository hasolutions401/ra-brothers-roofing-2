<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSubmissionRequest;
use App\Models\Submission;
use App\Notifications\NewSubmission;
use App\Notifications\RequestReceived;
use App\Support\PhotoStore;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Throwable;

use function Illuminate\Support\defer;

class SubmissionController extends Controller
{
    /**
     * Store a form submission. Spam has already been filtered out by the
     * RejectSpam middleware and the rate limiter.
     */
    public function store(StoreSubmissionRequest $request, PhotoStore $photos): JsonResponse
    {
        $submission = null;

        try {
            $submission = DB::transaction(function () use ($request, $photos, &$submission) {
                $submission = Submission::create($request->submissionAttributes());

                foreach ($request->file('photos', []) as $file) {
                    $photos->store($submission, $file);
                }

                return $submission;
            });
        } catch (Throwable $e) {
            // The rows are rolled back; remove any photo files already written.
            if ($submission?->getKey()) {
                Storage::disk('local')->deleteDirectory($submission->photoDirectory());
            }

            throw $e;
        }

        // After the response is sent, so a slow or failing mail server never
        // delays or loses the visitor's request.
        $emails = array_filter([
            [config('leads.notify_email'), NewSubmission::class],
            [config('leads.confirm_customer') ? $submission->email : null, RequestReceived::class],
        ], fn (array $email) => filled($email[0]));

        if ($emails) {
            defer(function () use ($emails, $submission) {
                foreach ($emails as [$to, $notification]) {
                    try {
                        Notification::route('mail', $to)->notify(new $notification($submission));
                    } catch (Throwable $e) {
                        report($e);
                    }
                }
            });
        }

        return response()->json(['message' => 'Thank you. Your request has been received.'], 201);
    }
}
