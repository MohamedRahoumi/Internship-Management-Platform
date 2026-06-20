<?php

namespace App\Repositories\Interfaces;

use App\Models\Evaluation;

interface EvaluationRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?Evaluation;
    public function findByIntern(int $internId): ?Evaluation;
    public function create(array $data): Evaluation;
    public function update(Evaluation $evaluation, array $data): Evaluation;
    public function delete(Evaluation $evaluation): bool;
}
