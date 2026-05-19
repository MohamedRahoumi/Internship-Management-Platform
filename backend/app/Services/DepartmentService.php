<?php

namespace App\Services;

use App\Models\Department;
use App\Repositories\Interfaces\DepartmentRepositoryInterface;

class DepartmentService
{
    public function __construct(
        private readonly DepartmentRepositoryInterface $departmentRepository,
    ) {}

    public function all(array $filters = [])
    {
        return $this->departmentRepository->all($filters);
    }

    public function findById(int $id): ?Department
    {
        return $this->departmentRepository->findById($id);
    }

    public function create(array $data): Department
    {
        return $this->departmentRepository->create($data);
    }

    public function update(int $id, array $data): Department
    {
        $department = $this->departmentRepository->findById($id);
        if (!$department) {
            throw new \RuntimeException('Département introuvable.');
        }
        return $this->departmentRepository->update($department, $data);
    }

    public function delete(int $id): bool
    {
        $department = $this->departmentRepository->findById($id);
        if (!$department) {
            throw new \RuntimeException('Département introuvable.');
        }
        return $this->departmentRepository->delete($department);
    }
}


