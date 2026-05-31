<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReportRequest;
use App\Http\Resources\ReportResource;
use App\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService,
    ) {}

    public function store(StoreReportRequest $request): JsonResponse
    {
        $intern = $request->user()->intern;

        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }

        $report = $this->reportService->submit(
            $intern->id,
            $request->only(['titre', 'description']),
            $request->file('file')
        );

        return response()->json(new ReportResource($report), 201);
    }

    public function show(int $id): JsonResponse
    {
        $report = $this->reportService->findById($id);

        if (!$report) {
            return response()->json(['message' => 'Rapport introuvable.'], 404);
        }

        return response()->json(new ReportResource($report));
    }

    public function myReport(Request $request): JsonResponse
    {
        $intern = $request->user()->intern;

        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }

        $report = $this->reportService->findByIntern($intern->id);

        if (!$report) {
            return response()->json(['message' => 'Aucun rapport soumis.'], 404);
        }

        return response()->json(new ReportResource($report));
    }

    public function internReport(int $internId): JsonResponse
    {
        $report = $this->reportService->findByIntern($internId);

        if (!$report) {
            return response()->json(['message' => 'Aucun rapport trouvé.'], 404);
        }

        return response()->json(new ReportResource($report));
    }
}


