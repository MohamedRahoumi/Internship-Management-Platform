<?php

namespace App\Repositories\Interfaces;

use App\Models\Intern;

interface InternRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?Intern;
    public function findByUser(int $userId): ?Intern;
    public function findByQrToken(string $qrToken): ?Intern;
    public function findBySupervisor(int $supervisorId);
    public function create(array $data): Intern;
    public function update(Intern $intern, array $data): Intern;
    public function delete(Intern $intern): bool;
    public function paginate(array $filters = [], int $perPage = 15);
}


