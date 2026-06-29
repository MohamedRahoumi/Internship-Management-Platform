<?php

namespace App\Http\Controllers;

use App\Http\Requests\ApproveApplicationRequest;
use App\Http\Requests\RejectApplicationRequest;
use App\Http\Requests\StoreApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly ApplicationService $applicationService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', \App\Models\InternshipApplication::class);

        $applications = $this->applicationService->all($request->only(['status', 'department_id', 'search']));

        return response()->json(ApplicationResource::collection($applications));
    }

    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\InternshipApplication::class);

        try {
            $application = $this->applicationService->create($request->user(), $request->validated());
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json(new ApplicationResource($application), 201);
    }

    public function show(int $id): JsonResponse
    {
        $application = $this->applicationService->findById($id);

        if (!$application) {
            return response()->json(['message' => 'Demande introuvable.'], 404);
        }

        $this->authorize('view', $application);

        return response()->json(new ApplicationResource($application));
    }

    public function myApplications(Request $request): JsonResponse
    {
        $user = $request->user();
        $applications = $this->applicationService->findByUser($user->id);

        return response()->json([
            'data' => ApplicationResource::collection($applications),
            'can_apply' => !$user->hasActiveInternship(),
        ]);
    }

    public function approve(int $id, ApproveApplicationRequest $request): JsonResponse
    {
        $this->authorize('approve', \App\Models\InternshipApplication::class);

        $application = $this->applicationService->approve($id, $request->validated());

        return response()->json(new ApplicationResource($application));
    }

    public function reject(int $id, RejectApplicationRequest $request): JsonResponse
    {
        $this->authorize('reject', \App\Models\InternshipApplication::class);

        $application = $this->applicationService->reject($id, $request->input('motif_refus'));

        return response()->json(new ApplicationResource($application));
    }

    public function markUnderReview(int $id): JsonResponse
    {
        $this->authorize('review', \App\Models\InternshipApplication::class);

        $application = $this->applicationService->markUnderReview($id);

        return response()->json(new ApplicationResource($application));
    }
}




