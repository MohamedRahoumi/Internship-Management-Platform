<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray($request): array
    {
        $data = [
            'id' => $this->id,
            'intern_id' => $this->intern_id,
            'titre' => $this->titre,
            'description' => $this->description,
            'file_url' => $this->file_path ? asset('storage/' . $this->file_path) : null,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];

        if ($this->resource->relationLoaded('intern') && $this->intern) {
            $internData = ['id' => $this->intern->id];
            if ($this->intern->relationLoaded('user') && $this->intern->user) {
                $internData['user'] = [
                    'prenom' => $this->intern->user->prenom,
                    'nom' => $this->intern->user->nom,
                ];
            }
            if ($this->intern->relationLoaded('department') && $this->intern->department) {
                $internData['department'] = [
                    'name' => $this->intern->department->name,
                ];
            }
            $data['intern'] = $internData;
        }

        return $data;
    }
}


