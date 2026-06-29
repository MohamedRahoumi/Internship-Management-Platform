<?php

namespace App\Http\Controllers;

use App\Http\Resources\AttendanceResource;
use App\Services\AttendanceService;
use App\Services\InternService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(
        private readonly AttendanceService $attendanceService,
        private readonly InternService $internService,
    ) {}

    public function myAttendance(Request $request): JsonResponse
    {
        $intern = $this->internService->findByUser($request->user()->id);
        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }

        $attendances = $this->attendanceService->findByIntern($intern->id);

        return response()->json(AttendanceResource::collection($attendances));
    }

    public function scan(Request $request): JsonResponse
    {
        $this->authorize('scan', \App\Models\Intern::class);

        $request->validate(['qr_token' => ['required', 'string']]);

        try {
            $attendance = $this->attendanceService->scan($request->input('qr_token'), $request->user());
            return response()->json(new AttendanceResource($attendance));
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function internHistory(int $internId): JsonResponse
    {
        $attendances = $this->attendanceService->findByIntern($internId);

        return response()->json(AttendanceResource::collection($attendances));
    }

    public function index(Request $request): JsonResponse
    {
        $attendances = $this->attendanceService->all($request->only(['intern_id', 'date']));

        return response()->json(AttendanceResource::collection($attendances));
    }
}


