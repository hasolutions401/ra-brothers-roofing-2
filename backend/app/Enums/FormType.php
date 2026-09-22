<?php

namespace App\Enums;

enum FormType: string
{
    /** Hero card on the home page: name, phone, town, need. */
    case Quick = 'quick';

    /** Four-step form on /free-estimate and the service and town pages. */
    case Estimate = 'estimate';

    public function label(): string
    {
        return match ($this) {
            self::Quick => 'Quick form',
            self::Estimate => 'Estimate form',
        };
    }
}
