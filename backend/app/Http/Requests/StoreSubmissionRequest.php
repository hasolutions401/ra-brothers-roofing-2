<?php

namespace App\Http\Requests;

use App\Enums\FormType;
use App\Rules\UsPhone;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A submission from either website form. The messages match the wording the
 * forms use for their own checks, so a visitor sees one consistent voice.
 */
class StoreSubmissionRequest extends FormRequest
{
    /** Free-text fields that stay on one line. */
    private const SINGLE_LINE = ['form_type', 'name', 'phone', 'email', 'town', 'address', 'service', 'property_type', 'roof_age', 'insurance', 'estimate_type', 'best_time'];

    protected function prepareForValidation(): void
    {
        $clean = [];

        foreach (self::SINGLE_LINE as $field) {
            if (is_string($value = $this->input($field))) {
                $clean[$field] = self::clean($value, multiline: false);
            }
        }

        if (is_string($notes = $this->input('notes'))) {
            $clean['notes'] = self::clean($notes, multiline: true);
        }

        if (is_array($conditions = $this->input('conditions'))) {
            $clean['conditions'] = array_values(array_map(
                fn ($value) => is_string($value) ? self::clean($value, multiline: false) : $value,
                $conditions,
            ));
        }

        if (isset($clean['email'])) {
            $clean['email'] = strtolower($clean['email']);
        }

        // Metadata never blocks a lead: anything odd is simply dropped.
        $page = $this->input('source_page');
        $clean['source_page'] = is_string($page) && strlen($page) <= 255 && preg_match('#^/[^\s]*$#', $page) ? $page : null;

        $this->merge($clean);
    }

    public function rules(): array
    {
        $options = config('leads.options');
        $photos = $options['photos'];
        $estimate = $this->input('form_type') === FormType::Estimate->value;

        $common = [
            'form_type' => ['required', Rule::enum(FormType::class)],
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:30', new UsPhone],
            'email' => ['nullable', 'string', 'email:rfc', 'max:190'],
        ];

        if (! $estimate) {
            return $common + [
                'town' => ['nullable', 'string', 'max:120'],
                'service' => ['nullable', 'string', Rule::in($options['quickNeeds'])],
                'photos' => ['prohibited'],
            ];
        }

        return $common + [
            'service' => ['required', 'string', Rule::in($options['services'])],
            'property_type' => ['required', 'string', Rule::in($options['propertyTypes'])],
            'roof_age' => ['required', 'string', Rule::in($options['roofAges'])],
            'conditions' => ['nullable', 'array', 'max:'.count($options['conditions'])],
            'conditions.*' => ['string', 'distinct', Rule::in($options['conditions'])],
            'insurance' => ['required', 'string', Rule::in($options['insurance'])],
            'town' => ['required', 'string', 'max:120'],
            'address' => ['nullable', 'string', 'max:255'],
            'estimate_type' => ['required', 'string', Rule::in($options['estimateTypes'])],
            'best_time' => ['required', 'string', Rule::in($options['bestTimes'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            'photos' => ['nullable', 'array', 'max:'.$photos['maxFiles']],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:'.$photos['maxKilobytes']],
        ];
    }

    public function messages(): array
    {
        $photos = config('leads.options.photos');

        return [
            'name.required' => 'Please add your name.',
            'phone.required' => 'Please add a phone number we can call back.',
            'email.email' => 'That email address does not look complete.',
            'service.required' => 'Choose the service closest to what you need.',
            'roof_age.required' => 'Pick a rough age, or “Not sure”.',
            'town.required' => 'Choose your town, or “My town is not on this list”.',
            'in' => 'Please choose one of the listed options.',
            'conditions.*.in' => 'Please choose from the listed options.',
            'photos.max' => "You can attach up to {$photos['maxFiles']} photos.",
            'photos.prohibited' => 'Photos can only be sent with the full estimate form.',
            'photos.*.image' => 'Photos must be JPG, PNG or WebP images.',
            'photos.*.mimes' => 'Photos must be JPG, PNG or WebP images.',
            'photos.*.max' => 'Each photo must be smaller than '.intdiv($photos['maxKilobytes'], 1024).' MB.',
            'photos.*.uploaded' => 'A photo could not be uploaded. Please try a smaller one.',
        ];
    }

    public function attributes(): array
    {
        return [
            'form_type' => 'form',
            'property_type' => 'property type',
            'roof_age' => 'roof age',
            'estimate_type' => 'estimate type',
            'best_time' => 'best time to reach you',
            'photos.*' => 'photo',
        ];
    }

    /**
     * Column values for the new Submission. Estimate-only answers go in the
     * `details` JSON column.
     *
     * @return array<string, mixed>
     */
    public function submissionAttributes(): array
    {
        $data = $this->validated();

        $attributes = [
            'form_type' => $data['form_type'],
            'name' => $data['name'],
            'phone' => UsPhone::format($data['phone']),
            'email' => $data['email'] ?? null,
            'town' => $data['town'] ?? null,
            'address' => $data['address'] ?? null,
            'service' => $data['service'] ?? null,
            'message' => $data['notes'] ?? null,
            'source_page' => $this->input('source_page'),
            'ip_address' => $this->ip(),
            'user_agent' => mb_substr((string) $this->userAgent(), 0, 500) ?: null,
        ];

        if ($data['form_type'] === FormType::Estimate->value) {
            $attributes['details'] = [
                'property_type' => $data['property_type'],
                'roof_age' => $data['roof_age'],
                'conditions' => array_values($data['conditions'] ?? []),
                'insurance' => $data['insurance'],
                'estimate_type' => $data['estimate_type'],
                'best_time' => $data['best_time'],
            ];
        }

        return $attributes;
    }

    /**
     * Valid UTF-8, no control or zero-width characters, trimmed. Output is
     * escaped wherever it is shown (React, email, CSV), so text is stored as
     * written rather than having characters such as < removed.
     */
    private static function clean(string $value, bool $multiline): string
    {
        $value = mb_scrub($value, 'UTF-8');
        $value = str_replace(["\r\n", "\r"], "\n", $value);
        $value = preg_replace('/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2064}\x{FEFF}]/u', '', $value);
        $value = preg_replace($multiline ? '/[^\P{C}\n\t]/u' : '/\p{C}/u', $multiline ? '' : ' ', $value);

        if (! $multiline) {
            $value = preg_replace('/\s+/u', ' ', $value);
        } else {
            $value = preg_replace("/\n{3,}/", "\n\n", $value);
        }

        return trim($value);
    }
}
