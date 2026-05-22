<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class InternshipApplication extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
        'cycle_formation',
        'niveau_etude',
        'etablissement',
        'ville_etablissement',
        'nom_complet_etablissement',
        'specialite',
        'date_debut',
        'date_fin',
        'duree',
        'status',
        'motif_refus',
        'whatsapp_confirmed',
        'dossier_envoye',
        'conditions_acceptees',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
            'whatsapp_confirmed' => 'boolean',
            'dossier_envoye' => 'boolean',
            'conditions_acceptees' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function intern(): HasOne
    {
        return $this->hasOne(Intern::class, 'application_id');
    }
}


