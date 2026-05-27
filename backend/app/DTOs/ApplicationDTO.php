<?php

namespace App\DTOs;

class ApplicationDTO
{
    public function __construct(
        public readonly string $cycle_formation,
        public readonly string $niveau_etude,
        public readonly string $ville_etablissement,
        public readonly string $type_etablissement,
        public readonly string $nom_complet_etablissement,
        public readonly string $specialite,
        public readonly string $date_debut,
        public readonly string $date_fin,
        public readonly int $duree,
        public readonly bool $whatsapp_confirmed,
        public readonly bool $dossier_envoye,
        public readonly bool $conditions_acceptees,
        public readonly ?string $civility = null,
        public readonly ?string $photo = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            cycle_formation: $data['cycle_formation'],
            niveau_etude: $data['niveau_etude'],
            ville_etablissement: $data['ville_etablissement'],
            type_etablissement: $data['type_etablissement'],
            nom_complet_etablissement: $data['nom_complet_etablissement'],
            specialite: $data['specialite'],
            date_debut: $data['date_debut'],
            date_fin: $data['date_fin'],
            duree: (int) $data['duree'],
            whatsapp_confirmed: (bool) ($data['whatsapp_confirmed'] ?? false),
            dossier_envoye: (bool) ($data['dossier_envoye'] ?? false),
            conditions_acceptees: (bool) ($data['conditions_acceptees'] ?? false),
            civility: $data['civility'] ?? null,
            photo: $data['photo'] ?? null,
        );
    }

    public function toArray(): array
    {
        return array_filter([
            'cycle_formation' => $this->cycle_formation,
            'niveau_etude' => $this->niveau_etude,
            'type_etablissement' => $this->type_etablissement,
            'ville_etablissement' => $this->ville_etablissement,
            'nom_complet_etablissement' => $this->nom_complet_etablissement,
            'specialite' => $this->specialite,
            'date_debut' => $this->date_debut,
            'date_fin' => $this->date_fin,
            'duree' => $this->duree,
            'whatsapp_confirmed' => $this->whatsapp_confirmed,
            'dossier_envoye' => $this->dossier_envoye,
            'conditions_acceptees' => $this->conditions_acceptees,
            'civility' => $this->civility,
            'photo' => $this->photo,
        ], fn ($v) => $v !== null);
    }
}


