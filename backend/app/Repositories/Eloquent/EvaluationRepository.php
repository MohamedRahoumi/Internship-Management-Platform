<?php

namespace App\Repositories\Eloquent;

use App\Models\Evaluation;
use App\Repositories\Interfaces\EvaluationRepositoryInterface;

class EvaluationRepository implements EvaluationRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Evaluation::with('intern.user', 'evaluator');
        if (!empty($filters['intern_id'])) {
            $query->where('intern_id', $filters['intern_id']);
        }
        return $query->latest()->get();
    }

    public function findById(int $id): ?Evaluation
    {
        return Evaluation::with('intern.user', 'evaluator', 'intern.department')->find($id);
    }

    public function findByIntern(int $internId): ?Evaluation
    {
        return Evaluation::where('intern_id', $internId)->first();
    }

    public function create(array $data): Evaluation
    {
        return Evaluation::create($data);
    }

    public function update(Evaluation $evaluation, array $data): Evaluation
    {
        $evaluation->update($data);
        return $evaluation->fresh();
    }

    public function delete(Evaluation $evaluation): bool
    {
        return $evaluation->delete();
    }
}


