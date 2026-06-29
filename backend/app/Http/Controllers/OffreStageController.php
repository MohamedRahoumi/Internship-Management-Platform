<?php

namespace App\Http\Controllers;

use App\Http\Resources\OffreStageResource;
use App\Services\InternService;
use App\Services\OffreStageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class OffreStageController extends Controller
{
    public function __construct(
        private readonly OffreStageService $offreStageService,
        private readonly InternService $internService,
    ) {}

    public function myOffre(Request $request): JsonResponse
    {
        $intern = $this->internService->findByUser($request->user()->id);
        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }
        $offre = $this->offreStageService->findByIntern($intern->id);
        if (!$offre) {
            return response()->json(['message' => 'Aucune offre de stage disponible.'], 404);
        }
        return response()->json(new OffreStageResource($offre));
    }

    public function download(int $id): BinaryFileResponse|JsonResponse
    {
        $offre = $this->offreStageService->findById($id);
        if (!$offre) {
            return response()->json(['message' => 'Offre introuvable.'], 404);
        }
        $path = $this->offreStageService->downloadPath($offre);
        if (!file_exists($path)) {
            return response()->json(['message' => 'Fichier PDF introuvable.'], 404);
        }
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="offre_stage.pdf"',
        ]);
    }

    public function downloadByIntern(Request $request): BinaryFileResponse|JsonResponse
    {
        $intern = $this->internService->findByUser($request->user()->id);
        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }
        $offre = $this->offreStageService->findByIntern($intern->id);
        if (!$offre) {
            return response()->json(['message' => 'Aucune offre de stage disponible.'], 404);
        }
        $path = $this->offreStageService->downloadPath($offre);
        if (!file_exists($path)) {
            return response()->json(['message' => 'Fichier PDF introuvable.'], 404);
        }
        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="offre_stage.pdf"',
        ]);
    }
}
