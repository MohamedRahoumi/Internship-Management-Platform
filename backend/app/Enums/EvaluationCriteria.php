<?php

namespace App\Enums;

enum EvaluationCriteria: string
{
    case CompetencesTechniques = 'competences_techniques';
    case Communication = 'communication';
    case Discipline = 'discipline';
    case Autonomie = 'autonomie';
    case TravailEquipe = 'travail_equipe';
    case QualiteRapport = 'qualite_rapport';

    public function label(): string
    {
        return match ($this) {
            self::CompetencesTechniques => 'Compétences techniques',
            self::Communication => 'Communication',
            self::Discipline => 'Discipline',
            self::Autonomie => 'Autonomie',
            self::TravailEquipe => 'Travail en équipe',
            self::QualiteRapport => 'Qualité du rapport',
        };
    }
}


