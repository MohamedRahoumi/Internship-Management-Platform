<?php

namespace App\Repositories\Interfaces;

use App\Models\InternshipApplication;

interface ApplicationRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?InternshipApplication;
    public function create(array $data): InternshipApplication;
    public function update(InternshipApplication $application, array $data): InternshipApplication;
    public function delete(InternshipApplication $application): bool;
    public function findByUser(int $userId);
    public function findByStatus(string $status);
    public function paginate(array $filters = [], int $perPage = 15);
}
