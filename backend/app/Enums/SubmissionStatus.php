<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case New = 'new';
    case Read = 'read';
    case Contacted = 'contacted';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::Read => 'Read',
            self::Contacted => 'Contacted',
        };
    }
}
