<?php

namespace App\Http\Resources;

use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A row in the dashboard table.
 *
 * @mixin Submission
 */
class SubmissionListResource extends JsonResource
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
            'service' => $this->service,
            'photos_count' => $this->whenCounted('photos'),
            'created_at' => $this->created_at?->toIso8601ZuluString(),
        ];
    }
}
