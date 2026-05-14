<?php

namespace App\Models;

use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'role',
        'department_id',
        'cin',
        'civility',
        'nom',
        'prenom',
        'telephone',
        'email',
        'password',
        'photo',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function internshipApplications(): HasMany
    {
        return $this->hasMany(InternshipApplication::class);
    }

    public function intern(): HasOne
    {
        return $this->hasOne(Intern::class);
    }

    public function supervisedInterns(): HasMany
    {
        return $this->hasMany(Intern::class, 'supervisor_id');
    }

    public function scannedAttendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'scanned_by');
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'evaluator_id');
    }

    public function generatedCertificates(): HasMany
    {
        return $this->hasMany(Certificate::class, 'generated_by');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    public function isAdministrator(): bool
    {
        return $this->role === UserRole::Administrator->value;
    }

    public function isRH(): bool
    {
        return $this->role === UserRole::RH->value;
    }

    public function isSupervisor(): bool
    {
        return $this->role === UserRole::Supervisor->value;
    }

    public function isIntern(): bool
    {
        return $this->role === UserRole::Intern->value;
    }
}


