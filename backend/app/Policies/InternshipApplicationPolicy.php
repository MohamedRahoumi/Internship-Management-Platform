<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\InternshipApplication;
use App\Models\User;

class InternshipApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Administrator->value, UserRole::RH->value]);
    }

    public function view(User $user, InternshipApplication $application): bool
    {
        if ($user->isAdministrator() || $user->isRH()) {
            return true;
        }
        return $user->id === $application->user_id;
    }

    public function create(User $user): bool
    {
        return $user->isIntern();
    }

    public function approve(User $user): bool
    {
        return $user->isRH() || $user->isAdministrator();
    }

    public function reject(User $user): bool
    {
        return $user->isRH() || $user->isAdministrator();
    }

    public function review(User $user): bool
    {
        return $user->isRH() || $user->isAdministrator();
    }
}


