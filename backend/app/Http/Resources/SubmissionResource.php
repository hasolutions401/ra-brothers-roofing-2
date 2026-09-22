<?php

namespace App\Http\Resources;

use App\Models\Submission;
use App\Models\SubmissionPhoto;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Everything about one submission, for the detail panel.
 *
 * @mixin Submission
 */
class SubmissionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'form_type' => $this->form_type->value,
            'form_label' => $this->form_type->label(),
            'status' => $this->status->value,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'town' => $this->town,
            'address' => $this->address,
            'service' => $this->service,
            'message' => $this->message,
            'details' => $this->details,
            'source_page' => $this->source_page,
            'ip_address' => $this->ip_address,
            'user_agent' => $this->user_agent,
            // Paths are relative to the API base URL, so they work whatever
            // host or scheme the API is reached through.
            'photos' => $this->whenLoaded('photos', fn () => $this->photos->map(fn (SubmissionPhoto $photo) => [
                'id' => $photo->id,
                'path' => "admin/submissions/{$this->id}/photos/{$photo->id}",
                'original_name' => $photo->original_name,
                'size' => $photo->size,
            ])),
            'read_at' => $this->read_at?->toIso8601ZuluString(),
            'contacted_at' => $this->contacted_at?->toIso8601ZuluString(),
            'created_at' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
