<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Evaluation;
use App\Models\User;

class EvaluationPolicy
{
    public function view(User $user, Evaluation $evaluation): bool
    {
        if ($user->isAdministrator() || $user->isRH()) {
            return true;
        }
        if ($user->isSupervisor()) {
            return $evaluation->intern->supervisor_id === $user->id;
        }
        return $evaluation->intern->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isSupervisor() || $user->isAdministrator();
    }

    public function update(User $user, Evaluation $evaluation): bool
    {
        return $evaluation->evaluator_id === $user->id || $user->isAdministrator();
    }
}


