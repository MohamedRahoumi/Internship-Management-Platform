<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;

class UserRepository implements UserRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = User::query();
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nom', 'like', "%{$filters['search']}%")
                  ->orWhere('prenom', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%")
                  ->orWhere('cin', 'like', "%{$filters['search']}%");
            });
        }
        return $query->with('department')->latest()->get();
    }

    public function findById(int $id): ?User
    {
        return User::with('department')->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }

    public function findByRole(string $role)
    {
        return User::where('role', $role)->with('department')->get();
    }

    public function paginate(array $filters = [], int $perPage = 15)
    {
        $query = User::query();
        if (!empty($filters['role'])) {
            $query->where('role', $filters['role']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('nom', 'like', "%{$filters['search']}%")
                  ->orWhere('prenom', 'like', "%{$filters['search']}%")
                  ->orWhere('email', 'like', "%{$filters['search']}%");
            });
        }
        return $query->with('department')->latest()->paginate($perPage);
    }
}




