<?php

namespace App\Http\Controllers\Admin;

use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ListSubmissionsRequest;
use App\Http\Requests\Admin\UpdateSubmissionRequest;
use App\Http\Resources\SubmissionListResource;
use App\Http\Resources\SubmissionResource;
use App\Models\Submission;
use App\Support\SubmissionCsv;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubmissionController extends Controller
{
    public function index(ListSubmissionsRequest $request): AnonymousResourceCollection
    {
        $page = $this->query($request)
            ->withCount('photos')
            ->paginate($request->integer('per_page', 25))
            ->withQueryString();

        return SubmissionListResource::collection($page);
    }

    /** Opening a new submission marks it as read, as an email client would. */
    public function show(Submission $submission): SubmissionResource
    {
        if ($submission->status === SubmissionStatus::New) {
            $submission->markAs(SubmissionStatus::Read);
        }

        return new SubmissionResource($submission->load('photos'));
    }

    public function update(UpdateSubmissionRequest $request, Submission $submission): SubmissionResource
    {
        $submission->markAs($request->enum('status', SubmissionStatus::class));

        return new SubmissionResource($submission->load('photos'));
    }

    /** Permanent, including the photo files (see Submission::booted). */
    public function destroy(Submission $submission): Response
    {
        $submission->delete();

        return response()->noContent();
    }

    /** CSV of every submission matching the current filters, in the current order. */
    public function export(ListSubmissionsRequest $request, SubmissionCsv $csv): StreamedResponse
    {
        $filename = 'leads-'.now(config('leads.timezone'))->format('Y-m-d').'.csv';

        return response()->streamDownload(
            fn () => $csv->write($this->query($request)->withCount('photos'), fopen('php://output', 'w')),
            $filename,
            ['Content-Type' => 'text/csv; charset=UTF-8', 'Cache-Control' => 'no-store, private'],
        );
    }

    /** @return Builder<Submission> */
    private function query(ListSubmissionsRequest $request): Builder
    {
        return Submission::query()
            ->filter($request->filters())
            ->orderBy($request->sortColumn(), $request->sortDirection())
            ->orderBy('id', $request->sortDirection());
    }
}
