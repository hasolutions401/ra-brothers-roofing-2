<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Ten-digit North American number, optionally prefixed with country code 1.
 * Mirrors isPhone() in src/components/form-styles.ts.
 */
class UsPhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $valid = is_string($value)
            && preg_match('/^[+\d\s().-]+$/', $value)
            && preg_match('/^1?\d{10}$/', preg_replace('/\D/', '', $value));

        if (! $valid) {
            $fail('Please add a phone number we can call back.');
        }
    }

    /** "(603) 555-1234", whatever format the visitor typed. */
    public static function format(string $value): string
    {
        $digits = substr(preg_replace('/\D/', '', $value), -10);

        return sprintf('(%s) %s-%s', substr($digits, 0, 3), substr($digits, 3, 3), substr($digits, 6));
    }
}
