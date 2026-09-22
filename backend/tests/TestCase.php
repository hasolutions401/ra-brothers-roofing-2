<?php

namespace Tests;

use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /** Where the dashboard runs in tests; listed in SANCTUM_STATEFUL_DOMAINS. */
    protected const SITE = 'http://localhost:3000';

    /** Requests the way the website sends them: from the site, expecting JSON. */
    protected function fromSite(): static
    {
        return $this->withHeaders(['Referer' => self::SITE.'/admin/', 'Accept' => 'application/json']);
    }

    protected function signedIn(): static
    {
        return $this->fromSite()->actingAs(User::factory()->create(), 'web');
    }

    /** @return array<string, mixed> */
    protected function quickPayload(array $overrides = []): array
    {
        return array_merge([
            'form_type' => 'quick',
            'name' => 'Pat Lee',
            'phone' => '603-555-0142',
            'town' => 'Salem',
            'service' => 'Roof repair or leak',
            'source_page' => '/',
            'elapsed_ms' => 12000,
            'hp_extra_info' => '',
        ], $overrides);
    }

    /** @return array<string, mixed> */
    protected function estimatePayload(array $overrides = []): array
    {
        return array_merge([
            'form_type' => 'estimate',
            'service' => 'Roof Repair',
            'property_type' => 'Residential',
            'roof_age' => '15 – 20 years',
            'conditions' => ['Active leak or water stain', 'Ice dams in winter'],
            'insurance' => 'Not sure yet',
            'town' => 'Windham, NH',
            'address' => '12 Range Rd',
            'estimate_type' => 'Remote, from photos (fastest)',
            'name' => 'Jordan Smith',
            'phone' => '(603) 555-0199',
            'email' => 'Jordan@Example.com',
            'best_time' => 'Morning',
            'notes' => "Leak over the kitchen.\nDog in the yard.",
            'source_page' => '/free-estimate/',
            'elapsed_ms' => 45000,
            'hp_extra_info' => '',
        ], $overrides);
    }
}
