<?php

namespace App\DTOs;

class EvaluationDTO
{
    public function __construct(
        public readonly int $competences_techniques,
        public readonly int $communication,
        public readonly int $discipline,
        public readonly int $autonomie,
        public readonly int $travail_equipe,
        public readonly int $qualite_rapport,
        public readonly ?string $commentaire_general,
        public readonly ?string $recommandation,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            competences_techniques: (int) $data['competences_techniques'],
            communication: (int) $data['communication'],
            discipline: (int) $data['discipline'],
            autonomie: (int) $data['autonomie'],
            travail_equipe: (int) $data['travail_equipe'],
            qualite_rapport: (int) $data['qualite_rapport'],
            commentaire_general: $data['commentaire_general'] ?? null,
            recommandation: $data['recommandation'] ?? null,
        );
    }

    public function calculateNoteFinale(): float
    {
        $total = $this->competences_techniques
            + $this->communication
            + $this->discipline
            + $this->autonomie
            + $this->travail_equipe
            + $this->qualite_rapport;

        return round($total / 6, 2);
    }

    public function toArray(): array
    {
        return [
            'competences_techniques' => $this->competences_techniques,
            'communication' => $this->communication,
            'discipline' => $this->discipline,
            'autonomie' => $this->autonomie,
            'travail_equipe' => $this->travail_equipe,
            'qualite_rapport' => $this->qualite_rapport,
            'note_finale' => $this->calculateNoteFinale(),
            'commentaire_general' => $this->commentaire_general,
            'recommandation' => $this->recommandation,
        ];
    }
}
