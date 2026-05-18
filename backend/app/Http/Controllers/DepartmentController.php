<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Services\DepartmentService;
use Illuminate\Http\JsonResponse;

class DepartmentController extends Controller
{
    public function __construct(
        private readonly DepartmentService $departmentService,
    ) {}

    public function index(): JsonResponse
    {
        $departments = $this->departmentService->all(request()->only('search'));

        return response()->json(DepartmentResource::collection($departments));
    }

    public function show(int $id): JsonResponse
    {
        $department = $this->departmentService->findById($id);

        if (!$department) {
            return response()->json(['message' => 'Département introuvable.'], 404);
        }

        return response()->json(new DepartmentResource($department));
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Department::class);

        $department = $this->departmentService->create($request->validated());

        return response()->json(new DepartmentResource($department), 201);
    }

    public function update(int $id, UpdateDepartmentRequest $request): JsonResponse
    {
        $this->authorize('update', \App\Models\Department::class);

        $department = $this->departmentService->update($id, $request->validated());

        return response()->json(new DepartmentResource($department));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->authorize('delete', \App\Models\Department::class);

        $this->departmentService->delete($id);

        return response()->json(['message' => 'Département supprimé.']);
    }
}


