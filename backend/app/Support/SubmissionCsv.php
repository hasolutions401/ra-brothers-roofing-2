<?php

namespace App\Support;

use App\Models\Submission;
use Illuminate\Database\Eloquent\Builder;

/**
 * Writes submissions as CSV that opens cleanly in Excel and Google Sheets.
 */
class SubmissionCsv
{
    private const HEADINGS = [
        'ID', 'Received', 'Form', 'Status', 'Name', 'Phone', 'Email', 'Town', 'Address', 'Service',
        'Property type', 'Roof age', 'Seeing', 'Insurance claim', 'Estimate type', 'Best time',
        'Notes', 'Photos', 'Sent from page', 'IP address',
    ];

    /**
     * @param  Builder<Submission>  $query
     * @param  resource  $out
     */
    public function write(Builder $query, $out): void
    {
        $tz = config('leads.timezone');

        // Byte-order mark, so Excel reads the file as UTF-8.
        fwrite($out, "\xEF\xBB\xBF");
        $this->row($out, [...self::HEADINGS]);

        foreach ($query->lazy(500) as $s) {
            $details = $s->details ?? [];

            $this->row($out, [
                $s->id,
                $s->created_at?->setTimezone($tz)->format('Y-m-d H:i'),
                $s->form_type->label(),
                $s->status->label(),
                $s->name,
                $s->phone,
                $s->email,
                $s->town,
                $s->address,
                $s->service,
                $details['property_type'] ?? null,
                $details['roof_age'] ?? null,
                implode('; ', $details['conditions'] ?? []),
                $details['insurance'] ?? null,
                $details['estimate_type'] ?? null,
                $details['best_time'] ?? null,
                $s->message,
                $s->photos_count ?? 0,
                $s->source_page,
                $s->ip_address,
            ]);
        }

        fclose($out);
    }

    /** @param  resource  $out */
    private function row($out, array $values): void
    {
        fputcsv($out, array_map($this->cell(...), $values), ',', '"', '');
    }

    /**
     * Spreadsheet apps run cells starting with = + - @ (or a tab or carriage
     * return) as formulas. A leading apostrophe makes them plain text, so a
     * visitor cannot plant a formula in the export.
     */
    private function cell(mixed $value): string
    {
        $value = (string) ($value ?? '');

        return preg_match('/^[=+\-@\t\r]/', $value) ? "'".$value : $value;
    }
}
