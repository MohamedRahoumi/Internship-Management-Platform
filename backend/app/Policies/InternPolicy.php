<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Intern;
use App\Models\User;

class InternPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Intern $intern): bool
    {
        if ($user->isAdministrator() || $user->isRH()) {
            return true;
        }
        if ($user->isSupervisor()) {
            return $intern->supervisor_id === $user->id;
        }
        return $intern->user_id === $user->id;
    }

    public function scan(User $user): bool
    {
        return $user->isSupervisor() || $user->isRH() || $user->isAdministrator();
    }
}


