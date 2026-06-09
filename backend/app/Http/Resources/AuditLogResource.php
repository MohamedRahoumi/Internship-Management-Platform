<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'nom' => $this->user->nom,
                'prenom' => $this->user->prenom,
                'email' => $this->user->email,
                'role' => $this->user->role,
                'full_name' => $this->user->nom . ' ' . $this->user->prenom,
            ]),
            'action' => $this->action,
            'model_type' => $this->model_type ? class_basename($this->model_type) : null,
            'model_id' => $this->model_id,
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'ip_address' => $this->ip_address,
            'description' => $this->getDescription(),
            'created_at' => $this->created_at->toISOString(),
            'created_at_human' => $this->created_at->diffForHumans(),
        ];
    }

    private function getDescription(): string
    {
        $model = $this->model_type ? class_basename($this->model_type) : 'Système';
        $actionLabels = [
            'login' => 'Connexion au système',
            'logout' => 'Déconnexion du système',
            'create' => "Création d'un(e) {$model}",
            'update' => "Modification d'un(e) {$model}",
            'delete' => "Suppression d'un(e) {$model}",
            'approve' => "Approbation d'un(e) {$model}",
            'reject' => "Rejet d'un(e) {$model}",
            'generate' => "Génération d'un(e) {$model}",
            'scan' => 'Scan de code QR',
        ];

        return $actionLabels[$this->action] ?? "{$this->action} sur {$model}";
    }
}


