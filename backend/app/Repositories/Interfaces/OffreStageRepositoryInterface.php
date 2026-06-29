<?php

namespace App\Repositories\Interfaces;

use App\Models\OffreStage;

interface OffreStageRepositoryInterface
{
    public function all();
    public function findById(int $id): ?OffreStage;
    public function create(array $data): OffreStage;
    public function findByIntern(int $internId): ?OffreStage;
    public function findByReference(string $reference): ?OffreStage;
}
