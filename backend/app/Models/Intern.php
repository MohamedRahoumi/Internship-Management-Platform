<?php

namespace App\Models;

use App\Enums\InternStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Intern extends Model
{
    protected $fillable = [
        'user_id',
        'supervisor_id',
        'department_id',
        'application_id',
        'qr_token',
        'date_debut',
        'date_fin',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'date_fin' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(InternshipApplication::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function report(): HasOne
    {
        return $this->hasOne(InternshipReport::class);
    }

    public function evaluation(): HasOne
    {
        return $this->hasOne(Evaluation::class);
    }

    public function certificate(): HasOne
    {
        return $this->hasOne(Certificate::class);
    }

    public function offreStage(): HasOne
    {
        return $this->hasOne(OffreStage::class);
    }
}


