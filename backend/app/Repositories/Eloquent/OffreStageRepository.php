<?php

namespace App\Repositories\Eloquent;

use App\Models\OffreStage;
use App\Repositories\Interfaces\OffreStageRepositoryInterface;

class OffreStageRepository implements OffreStageRepositoryInterface
{
    public function all()
    {
        return OffreStage::with('intern.user', 'intern.department')->latest()->get();
    }

    public function findById(int $id): ?OffreStage
    {
        return OffreStage::with('intern.user', 'intern.department', 'application', 'generator')->find($id);
    }

    public function create(array $data): OffreStage
    {
        return OffreStage::create($data);
    }

    public function findByIntern(int $internId): ?OffreStage
    {
        return OffreStage::where('intern_id', $internId)->first();
    }

    public function findByReference(string $reference): ?OffreStage
    {
        return OffreStage::where('reference', $reference)->first();
    }
}
