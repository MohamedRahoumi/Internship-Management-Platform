<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class DepartmentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function update(User $user): bool
    {
        return $user->isAdministrator();
    }

    public function delete(User $user): bool
    {
        return $user->isAdministrator();
    }
}


