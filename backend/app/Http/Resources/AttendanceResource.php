<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'intern_id' => $this->intern_id,
            'intern' => new InternResource($this->whenLoaded('intern')),
            'scanner' => new UserResource($this->whenLoaded('scanner')),
            'check_in_at' => $this->check_in_at,
            'check_out_at' => $this->check_out_at,
            'date' => $this->date,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}
