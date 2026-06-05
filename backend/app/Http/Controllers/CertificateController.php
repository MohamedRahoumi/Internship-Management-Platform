<?php

namespace App\Http\Controllers;

use App\Http\Resources\CertificateResource;
use App\Services\CertificateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function __construct(
        private readonly CertificateService $certificateService,
    ) {}

    public function generate(int $internId, Request $request): JsonResponse
    {
        $this->authorize('generate', \App\Models\Certificate::class);

        try {
            $certificate = $this->certificateService->generate($internId, $request->user());
            return response()->json(new CertificateResource($certificate), 201);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }
    }

    public function show(int $id): JsonResponse
    {
        $certificate = $this->certificateService->findById($id);

        if (!$certificate) {
            return response()->json(['message' => 'Certificat introuvable.'], 404);
        }

        $this->authorize('view', $certificate);

        return response()->json(new CertificateResource($certificate));
    }

    public function myCertificate(Request $request): JsonResponse
    {
        $intern = $request->user()->intern;

        if (!$intern) {
            return response()->json(['message' => 'Profil stagiaire introuvable.'], 404);
        }

        $certificate = $this->certificateService->findByIntern($intern->id);

        if (!$certificate) {
            return response()->json(['message' => 'Aucun certificat trouvé.'], 404);
        }

        return response()->json(new CertificateResource($certificate));
    }
}


