<?php

namespace App\Http\Controllers;

use App\Services\InternService;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Request;

class QrCodeController extends Controller
{
    public function __construct(
        private readonly InternService $internService,
    ) {}

    public function show(Request $request)
    {
        $intern = $this->internService->findByUser($request->user()->id);
        if (!$intern || !$intern->qr_token) {
            return response()->json(['message' => 'QR code non disponible.'], 404);
        }

        $result = (new Builder())->build(
            writer: new PngWriter(),
            data: $intern->qr_token,
            size: 300,
            margin: 10,
        );

        return response($result->getString())
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'private, max-age=3600');
    }
}
