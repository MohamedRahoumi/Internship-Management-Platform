<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'intern_id' => $this->intern_id,
            'evaluation' => new EvaluationResource($this->whenLoaded('evaluation')),
            'certificate_number' => $this->certificate_number,
            'file_url' => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'signed_by' => $this->signed_by,
            'created_at' => $this->created_at,
        ];
    }
}
