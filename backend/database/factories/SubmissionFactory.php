<?php

namespace Database\Factories;

use App\Enums\FormType;
use App\Enums\SubmissionStatus;
use App\Models\Submission;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Submission>
 */
class SubmissionFactory extends Factory
{
    private const TOWNS = ['Salem, NH', 'Windham, NH', 'Pelham, NH', 'Derry, NH', 'Hudson, NH', 'Methuen, MA', 'Andover, MA', 'Haverhill, MA', 'Lawrence, MA'];

    public function definition(): array
    {
        $status = fake()->randomElement(SubmissionStatus::cases());
        $created = fake()->dateTimeBetween('-45 days');

        return [
            'form_type' => FormType::Quick,
            'status' => $status,
            'name' => fake()->name(),
            'phone' => fake()->numerify('(603) ###-####'),
            'email' => null,
            'town' => fake()->randomElement(self::TOWNS),
            'service' => fake()->randomElement(config('leads.options.quickNeeds')),
            'source_page' => '/',
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'read_at' => $status === SubmissionStatus::New ? null : $created,
            'contacted_at' => $status === SubmissionStatus::Contacted ? $created : null,
            'created_at' => $created,
            'updated_at' => $created,
        ];
    }

    public function quick(): static
    {
        return $this->state(['form_type' => FormType::Quick]);
    }

    public function estimate(): static
    {
        $options = config('leads.options');

        return $this->state(fn () => [
            'form_type' => FormType::Estimate,
            'email' => fake()->boolean(70) ? fake()->safeEmail() : null,
            'address' => fake()->boolean(60) ? fake()->streetAddress() : null,
            'service' => fake()->randomElement($options['services']),
            'message' => fake()->boolean(50) ? fake()->sentence(12) : null,
            'source_page' => fake()->randomElement(['/free-estimate/', '/services/roof-repair/', '/service-areas/salem-nh/']),
            'details' => [
                'property_type' => fake()->randomElement($options['propertyTypes']),
                'roof_age' => fake()->randomElement($options['roofAges']),
                'conditions' => fake()->randomElements($options['conditions'], fake()->numberBetween(0, 3)),
                'insurance' => fake()->randomElement($options['insurance']),
                'estimate_type' => fake()->randomElement($options['estimateTypes']),
                'best_time' => fake()->randomElement($options['bestTimes']),
            ],
        ]);
    }

    public function status(SubmissionStatus $status): static
    {
        return $this->state(['status' => $status]);
    }
}
