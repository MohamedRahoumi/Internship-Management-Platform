<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'civility' => $this->civility,
            'photo' => $this->photo,
            'cycle_formation' => $this->cycle_formation,
            'niveau_etude' => $this->niveau_etude,
            'ville_etablissement' => $this->ville_etablissement,
            'type_etablissement' => $this->type_etablissement,
            'nom_complet_etablissement' => $this->nom_complet_etablissement,
            'specialite' => $this->specialite,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
            'duree' => $this->duree,
            'status' => $this->status,
            'motif_refus' => $this->motif_refus,
            'whatsapp_confirmed' => $this->whatsapp_confirmed,
            'dossier_envoye' => $this->dossier_envoye,
            'conditions_acceptees' => $this->conditions_acceptees,
            'created_at' => $this->created_at,
        ];
    }
}


