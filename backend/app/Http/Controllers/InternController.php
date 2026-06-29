<?php

namespace App\Http\Controllers;

use App\Http\Resources\InternResource;
use App\Services\InternService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InternController extends Controller
{
    public function __construct(
        private readonly InternService $internService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isSupervisor()) {
            $interns = $this->internService->findBySupervisor($user->id);
        } else {
            $interns = $this->internService->all($request->only(['department_id', 'status', 'supervisor_id', 'search']));
        }

        return response()->json(InternResource::collection($interns));
    }

    public function show(int $id): JsonResponse
    {
        $intern = $this->internService->findById($id);

        if (!$intern) {
            return response()->json(['message' => 'Stagiaire introuvable.'], 404);
        }

        $this->authorize('view', $intern);

        return response()->json(new InternResource($intern));
    }

    public function myProfile(Request $request): JsonResponse
    {
        $intern = $this->internService->findByUser($request->user()->id);

        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }

        return response()->json(new InternResource($intern));
    }
}




