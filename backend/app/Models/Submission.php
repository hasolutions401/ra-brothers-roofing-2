<?php

namespace App\Models;

use App\Enums\FormType;
use App\Enums\SubmissionStatus;
use Carbon\CarbonImmutable;
use Database\Factories\SubmissionFactory;
use Illuminate\Database\Eloquent\Attributes\Guarded;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

#[Guarded(['id'])]
class Submission extends Model
{
    /** @use HasFactory<SubmissionFactory> */
    use HasFactory;

    /** Columns the dashboard may sort by. */
    public const SORTABLE = ['created_at', 'name', 'form_type', 'status', 'town', 'service'];

    protected $attributes = [
        'status' => 'new',
    ];

    protected function casts(): array
    {
        return [
            'form_type' => FormType::class,
            'status' => SubmissionStatus::class,
            'details' => 'array',
            'read_at' => 'datetime',
            'contacted_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Submission $submission) {
            $submission->phone_digits = substr(preg_replace('/\D/', '', (string) $submission->phone), -15);
        });

        // Photo rows go with the database cascade; the files need removing too.
        static::deleted(function (Submission $submission) {
            Storage::disk('local')->deleteDirectory($submission->photoDirectory());
        });
    }

    /** @return HasMany<SubmissionPhoto, $this> */
    public function photos(): HasMany
    {
        return $this->hasMany(SubmissionPhoto::class);
    }

    public function photoDirectory(): string
    {
        return "submissions/{$this->getKey()}";
    }

    /**
     * Move to a status, keeping read_at and contacted_at consistent with it:
     * contacted implies read, and moving back clears the later timestamps.
     */
    public function markAs(SubmissionStatus $status): void
    {
        $this->status = $status;

        if ($status === SubmissionStatus::New) {
            $this->read_at = null;
        } else {
            $this->read_at ??= now();
        }

        $this->contacted_at = $status === SubmissionStatus::Contacted
            ? ($this->contacted_at ?? now())
            : null;

        $this->save();
    }

    /**
     * Dashboard search and filters. Dates are whole days in the business's
     * time zone; stored timestamps are UTC.
     *
     * @param  array{search?: ?string, form_type?: ?string, status?: ?string, from?: ?string, to?: ?string}  $filters
     */
    #[Scope]
    protected function filter(Builder $query, array $filters): void
    {
        $tz = config('leads.timezone');

        $query
            ->when($filters['search'] ?? null, function (Builder $query, string $term) {
                $like = '%'.$term.'%';
                $digits = preg_replace('/\D/', '', $term);

                $query->where(function (Builder $query) use ($like, $digits) {
                    foreach (['name', 'email', 'phone', 'town', 'address', 'service', 'message'] as $column) {
                        $query->orWhere($column, 'like', $like);
                    }

                    if (strlen($digits) >= 3) {
                        $query->orWhere('phone_digits', 'like', '%'.$digits.'%');
                    }
                });
            })
            ->when($filters['form_type'] ?? null, fn (Builder $query, string $type) => $query->where('form_type', $type))
            ->when($filters['status'] ?? null, fn (Builder $query, string $status) => $query->where('status', $status))
            ->when($filters['from'] ?? null, fn (Builder $query, string $from) => $query->where(
                'created_at', '>=', CarbonImmutable::createFromFormat('!Y-m-d', $from, $tz)->utc(),
            ))
            ->when($filters['to'] ?? null, fn (Builder $query, string $to) => $query->where(
                'created_at', '<', CarbonImmutable::createFromFormat('!Y-m-d', $to, $tz)->addDay()->utc(),
            ));
    }
}
