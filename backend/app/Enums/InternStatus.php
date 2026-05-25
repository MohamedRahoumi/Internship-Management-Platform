<?php

namespace App\Enums;

enum InternStatus: string
{
    case Active = 'active';
    case Completed = 'completed';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Actif',
            self::Completed => 'Terminé',
            self::Suspended => 'Suspendu',
        };
    }
}


