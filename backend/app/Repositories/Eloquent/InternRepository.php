<?php

namespace App\Repositories\Eloquent;

use App\Models\Intern;
use App\Repositories\Interfaces\InternRepositoryInterface;

class InternRepository implements InternRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Intern::with('user', 'department', 'supervisor');
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['supervisor_id'])) {
            $query->where('supervisor_id', $filters['supervisor_id']);
        }
        return $query->latest()->get();
    }

    public function findById(int $id): ?Intern
    {
        return Intern::with('user', 'department', 'supervisor', 'attendances', 'report', 'evaluation', 'certificate')->find($id);
    }

    public function findByUser(int $userId): ?Intern
    {
        return Intern::with('department', 'supervisor', 'attendances', 'report', 'evaluation', 'certificate')
            ->where('user_id', $userId)
            ->first();
    }

    public function findByQrToken(string $qrToken): ?Intern
    {
        return Intern::with('user', 'department')
            ->where('qr_token', $qrToken)
            ->first();
    }

    public function findBySupervisor(int $supervisorId)
    {
        return Intern::where('supervisor_id', $supervisorId)
            ->with('user', 'department')
            ->latest()
            ->get();
    }

    public function create(array $data): Intern
    {
        return Intern::create($data);
    }

    public function update(Intern $intern, array $data): Intern
    {
        $intern->update($data);
        return $intern->fresh();
    }

    public function delete(Intern $intern): bool
    {
        return $intern->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15)
    {
        $query = Intern::with('user', 'department', 'supervisor');
        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['supervisor_id'])) {
            $query->where('supervisor_id', $filters['supervisor_id']);
        }
        return $query->latest()->paginate($perPage);
    }
}


