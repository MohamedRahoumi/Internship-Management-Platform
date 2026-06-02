<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    protected $fillable = [
        'intern_id',
        'evaluator_id',
        'competences_techniques',
        'communication',
        'discipline',
        'autonomie',
        'travail_equipe',
        'qualite_rapport',
        'note_finale',
        'commentaire_general',
        'recommandation',
    ];

    public function intern(): BelongsTo
    {
        return $this->belongsTo(Intern::class);
    }

    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}


