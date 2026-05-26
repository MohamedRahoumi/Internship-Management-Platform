<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class InternResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'supervisor' => new UserResource($this->whenLoaded('supervisor')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'qr_token' => $this->qr_token,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
            'status' => $this->status,
            'attendances' => AttendanceResource::collection($this->whenLoaded('attendances')),
            'report' => new ReportResource($this->whenLoaded('report')),
            'evaluation' => new EvaluationResource($this->whenLoaded('evaluation')),
            'certificate' => new CertificateResource($this->whenLoaded('certificate')),
            'created_at' => $this->created_at,
        ];
    }
}


