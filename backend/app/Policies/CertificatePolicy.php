<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Certificate;
use App\Models\User;

class CertificatePolicy
{
    public function view(User $user, Certificate $certificate): bool
    {
        if ($user->isAdministrator() || $user->isRH()) {
            return true;
        }
        return $certificate->intern->user_id === $user->id;
    }

    public function generate(User $user): bool
    {
        return $user->isRH() || $user->isAdministrator();
    }
}


