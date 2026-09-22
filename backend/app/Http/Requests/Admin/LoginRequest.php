<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /** Emails are stored lowercase; match them the same way on every database. */
    protected function prepareForValidation(): void
    {
        if (is_string($email = $this->input('email'))) {
            $this->merge(['email' => strtolower(trim($email))]);
        }
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:190'],
            'password' => ['required', 'string', 'max:200'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required' => 'Enter your email address.',
            'email.email' => 'Enter a valid email address.',
            'password.required' => 'Enter your password.',
        ];
    }
}
