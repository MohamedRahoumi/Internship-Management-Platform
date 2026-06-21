<?php

namespace App\Repositories\Interfaces;

use App\Models\Certificate;

interface CertificateRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?Certificate;
    public function findByIntern(int $internId): ?Certificate;
    public function create(array $data): Certificate;
    public function update(Certificate $certificate, array $data): Certificate;
    public function delete(Certificate $certificate): bool;
}
