<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'intern_id' => $this->intern_id,
            'titre' => $this->titre,
            'description' => $this->description,
            'file_url' => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}


