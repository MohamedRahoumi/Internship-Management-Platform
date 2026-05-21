<?php

namespace App\Repositories\Interfaces;

use App\Models\Department;

interface DepartmentRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?Department;
    public function create(array $data): Department;
    public function update(Department $department, array $data): Department;
    public function delete(Department $department): bool;
}


