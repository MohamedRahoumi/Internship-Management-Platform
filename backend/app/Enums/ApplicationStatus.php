<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Pending = 'pending';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Rejected = 'rejected';
    case Active = 'active';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'En attente',
            self::UnderReview => 'En cours d\'examen',
            self::Approved => 'Approuvée',
            self::Rejected => 'Refusée',
            self::Active => 'Active',
            self::Completed => 'Terminée',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::Pending => 'yellow',
            self::UnderReview => 'blue',
            self::Approved => 'green',
            self::Rejected => 'red',
            self::Active => 'indigo',
            self::Completed => 'gray',
        };
    }
}


