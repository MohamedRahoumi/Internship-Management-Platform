<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OffreStageResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'intern' => new InternResource($this->whenLoaded('intern')),
            'application_id' => $this->application_id,
            'file_path' => $this->file_path,
            'generated_by' => $this->generated_by,
            'created_at' => $this->created_at,
        ];
    }
}
