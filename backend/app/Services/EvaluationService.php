<?php

namespace App\Services;

use App\DTOs\EvaluationDTO;
use App\Models\Evaluation;
use App\Repositories\Interfaces\EvaluationRepositoryInterface;

class EvaluationService
{
    public function __construct(
        private readonly EvaluationRepositoryInterface $evaluationRepository,
    ) {}

    public function create(int $internId, int $evaluatorId, array $data): Evaluation
    {
        $dto = EvaluationDTO::fromRequest($data);
        $evaluationData = $dto->toArray();
        $evaluationData['intern_id'] = $internId;
        $evaluationData['evaluator_id'] = $evaluatorId;

        return $this->evaluationRepository->create($evaluationData);
    }

    public function findByIntern(int $internId): ?Evaluation
    {
        return $this->evaluationRepository->findByIntern($internId);
    }

    public function findById(int $id): ?Evaluation
    {
        return $this->evaluationRepository->findById($id);
    }

    public function update(int $id, array $data): Evaluation
    {
        $evaluation = $this->evaluationRepository->findById($id);
        if (!$evaluation) {
            throw new \RuntimeException('Évaluation introuvable.');
        }

        $dto = EvaluationDTO::fromRequest($data);
        return $this->evaluationRepository->update($evaluation, $dto->toArray());
    }

    public function all(array $filters = [])
    {
        return $this->evaluationRepository->all($filters);
    }
}




