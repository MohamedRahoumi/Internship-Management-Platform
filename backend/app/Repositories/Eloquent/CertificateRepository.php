<?php

namespace App\Repositories\Eloquent;

use App\Models\Certificate;
use App\Repositories\Interfaces\CertificateRepositoryInterface;

class CertificateRepository implements CertificateRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Certificate::with('intern.user', 'generator');
        return $query->latest()->get();
    }

    public function findById(int $id): ?Certificate
    {
        return Certificate::with('intern.user', 'generator', 'evaluation')->find($id);
    }

    public function findByIntern(int $internId): ?Certificate
    {
        return Certificate::where('intern_id', $internId)->first();
    }

    public function create(array $data): Certificate
    {
        return Certificate::create($data);
    }

    public function update(Certificate $certificate, array $data): Certificate
    {
        $certificate->update($data);
        return $certificate->fresh();
    }

    public function delete(Certificate $certificate): bool
    {
        return $certificate->delete();
    }
}


