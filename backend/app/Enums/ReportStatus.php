<?php

namespace App\Enums;

enum ReportStatus: string
{
    case Submitted = 'submitted';
    case UnderReview = 'under_review';
    case Approved = 'approved';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Submitted => 'Soumis',
            self::UnderReview => 'En cours d\'examen',
            self::Approved => 'Approuvé',
            self::Rejected => 'Refusé',
        };
    }
}


