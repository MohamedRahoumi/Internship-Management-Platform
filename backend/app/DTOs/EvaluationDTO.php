<?php

namespace App\DTOs;

class EvaluationDTO
{
    public function __construct(
        public readonly array $scores,
        public readonly ?string $observations,
        public readonly ?string $recommandation,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            scores: $data['scores'] ?? [],
            observations: $data['observations'] ?? null,
            recommandation: $data['recommandation'] ?? null,
        );
    }

    public function calculateNoteFinale(): float
    {
        $values = array_values($this->scores);
        if (empty($values)) return 0;
        return round(array_sum($values) / count($values), 2);
    }

    public function toArray(): array
    {
        return [
            'scores' => $this->scores,
            'note_finale' => $this->calculateNoteFinale(),
            'observations' => $this->observations,
            'recommandation' => $this->recommandation,
        ];
    }
}
