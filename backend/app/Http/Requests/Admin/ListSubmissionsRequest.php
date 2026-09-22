<?php

namespace App\Http\Requests\Admin;

use App\Enums\FormType;
use App\Enums\SubmissionStatus;
use App\Models\Submission;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/** Search, filters and sorting for the list and the CSV export. */
class ListSubmissionsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'form_type' => ['nullable', Rule::enum(FormType::class)],
            'status' => ['nullable', Rule::enum(SubmissionStatus::class)],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
            'sort' => ['nullable', Rule::in(Submission::SORTABLE)],
            'dir' => ['nullable', Rule::in(['asc', 'desc'])],
            'per_page' => ['nullable', 'integer', Rule::in([10, 25, 50, 100])],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'to.after_or_equal' => 'The end date must be on or after the start date.',
        ];
    }

    /** @return array{search: ?string, form_type: ?string, status: ?string, from: ?string, to: ?string} */
    public function filters(): array
    {
        return [
            'search' => $this->validated('search'),
            'form_type' => $this->validated('form_type'),
            'status' => $this->validated('status'),
            'from' => $this->validated('from'),
            'to' => $this->validated('to'),
        ];
    }

    public function sortColumn(): string
    {
        return $this->validated('sort') ?? 'created_at';
    }

    public function sortDirection(): string
    {
        return $this->validated('dir') ?? 'desc';
    }
}
