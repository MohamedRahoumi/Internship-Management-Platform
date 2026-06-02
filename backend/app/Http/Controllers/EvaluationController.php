<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Resources\EvaluationResource;
use App\Services\EvaluationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function __construct(
        private readonly EvaluationService $evaluationService,
    ) {}

    public function store(int $internId, StoreEvaluationRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Evaluation::class);

        $evaluation = $this->evaluationService->create(
            $internId,
            $request->user()->id,
            $request->validated()
        );

        return response()->json(new EvaluationResource($evaluation), 201);
    }

    public function show(int $id): JsonResponse
    {
        $evaluation = $this->evaluationService->findById($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation introuvable.'], 404);
        }

        $this->authorize('view', $evaluation);

        return response()->json(new EvaluationResource($evaluation));
    }

    public function internEvaluation(int $internId): JsonResponse
    {
        $evaluation = $this->evaluationService->findByIntern($internId);

        if (!$evaluation) {
            return response()->json(['message' => 'Aucune évaluation trouvée.'], 404);
        }

        return response()->json(new EvaluationResource($evaluation));
    }

    public function update(int $id, StoreEvaluationRequest $request): JsonResponse
    {
        $evaluation = $this->evaluationService->findById($id);

        if (!$evaluation) {
            return response()->json(['message' => 'Évaluation introuvable.'], 404);
        }

        $this->authorize('update', $evaluation);

        $evaluation = $this->evaluationService->update($id, $request->validated());

        return response()->json(new EvaluationResource($evaluation));
    }

    public function index(Request $request): JsonResponse
    {
        $evaluations = $this->evaluationService->all($request->only(['intern_id']));

        return response()->json(EvaluationResource::collection($evaluations));
    }
}




