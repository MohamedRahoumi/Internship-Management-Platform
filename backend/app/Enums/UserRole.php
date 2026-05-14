<?php

namespace App\Enums;

enum UserRole: string
{
    case Administrator = 'administrator';
    case RH = 'rh';
    case Supervisor = 'supervisor';
    case Intern = 'intern';

    public function label(): string
    {
        return match ($this) {
            self::Administrator => 'Administrateur',
            self::RH => 'RH',
            self::Supervisor => 'Encadrant',
            self::Intern => 'Stagiaire',
        };
    }
}




