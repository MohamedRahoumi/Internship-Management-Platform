<?php

namespace App\Services;

use App\Models\Intern;
use App\Repositories\Interfaces\InternRepositoryInterface;

class InternService
{
    public function __construct(
        private readonly InternRepositoryInterface $internRepository,
    ) {}

    public function all(array $filters = [])
    {
        return $this->internRepository->paginate($filters);
    }

    public function findById(int $id): ?Intern
    {
        return $this->internRepository->findById($id);
    }

    public function findByUser(int $userId): ?Intern
    {
        return $this->internRepository->findByUser($userId);
    }

    public function findBySupervisor(int $supervisorId)
    {
        return $this->internRepository->findBySupervisor($supervisorId);
    }

    public function findByQrToken(string $qrToken): ?Intern
    {
        return $this->internRepository->findByQrToken($qrToken);
    }

    public function update(int $id, array $data): Intern
    {
        $intern = $this->internRepository->findById($id);
        if (!$intern) {
            throw new \RuntimeException('Stagiaire introuvable.');
        }
        return $this->internRepository->update($intern, $data);
    }
}


