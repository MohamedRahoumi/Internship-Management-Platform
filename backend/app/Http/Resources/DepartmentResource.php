<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'users_count' => $this->whenCounted('users'),
            'interns_count' => $this->whenCounted('interns'),
            'created_at' => $this->created_at,
        ];
    }
}


