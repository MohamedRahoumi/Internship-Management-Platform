<?php

namespace App\Repositories\Eloquent;

use App\Models\InternshipApplication;
use App\Repositories\Interfaces\ApplicationRepositoryInterface;

class ApplicationRepository implements ApplicationRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = InternshipApplication::with('user', 'department');
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })->orWhere('specialite', 'like', "%{$search}%");
            });
        }
        return $query->latest()->get();
    }

    public function findById(int $id): ?InternshipApplication
    {
        return InternshipApplication::with('user', 'department', 'intern')->find($id);
    }

    public function create(array $data): InternshipApplication
    {
        return InternshipApplication::create($data);
    }

    public function update(InternshipApplication $application, array $data): InternshipApplication
    {
        $application->update($data);
        return $application->fresh();
    }

    public function delete(InternshipApplication $application): bool
    {
        return $application->delete();
    }

    public function findByUser(int $userId)
    {
        return InternshipApplication::where('user_id', $userId)
            ->with('department')
            ->latest()
            ->get();
    }

    public function findByStatus(string $status)
    {
        return InternshipApplication::where('status', $status)
            ->with('user', 'department')
            ->latest()
            ->get();
    }

    public function paginate(array $filters = [], int $perPage = 15)
    {
        $query = InternshipApplication::with('user', 'department');
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                })->orWhere('specialite', 'like', "%{$search}%");
            });
        }
        return $query->latest()->paginate($perPage);
    }
}




