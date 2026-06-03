<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EvaluationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'intern_id' => $this->intern_id,
            'evaluator' => new UserResource($this->whenLoaded('evaluator')),
            'competences_techniques' => $this->competences_techniques,
            'communication' => $this->communication,
            'discipline' => $this->discipline,
            'autonomie' => $this->autonomie,
            'travail_equipe' => $this->travail_equipe,
            'qualite_rapport' => $this->qualite_rapport,
            'note_finale' => $this->note_finale,
            'commentaire_general' => $this->commentaire_general,
            'recommandation' => $this->recommandation,
            'created_at' => $this->created_at,
        ];
    }
}


