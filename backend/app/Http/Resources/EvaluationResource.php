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
            'scores' => $this->scores,
            'note_finale' => $this->note_finale,
            'observations' => $this->observations,
            'recommandation' => $this->recommandation,
            'created_at' => $this->created_at,
        ];
    }
}


