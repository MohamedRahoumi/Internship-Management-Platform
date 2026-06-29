<?php

namespace App\Services;

use App\Mail\OffreStageMail;
use App\Models\Intern;
use App\Models\OffreStage;
use App\Models\User;
use App\Repositories\Interfaces\OffreStageRepositoryInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OffreStageService
{
    public function __construct(
        private readonly OffreStageRepositoryInterface $offreStageRepository,
        private readonly AuditService $auditService,
    ) {}

    public function generate(Intern $intern, User $generator): ?OffreStage
    {
        $application = $intern->application;

        $reference = 'OFFRE-' . strtoupper(Str::random(8));

        $data = [
            'intern' => $intern->load('user', 'department', 'supervisor'),
            'application' => $application,
            'reference' => $reference,
        ];

        $pdf = Pdf::loadView('offres.template', $data);
        $filePath = "offres/{$reference}.pdf";
        $pdf->save(storage_path("app/public/{$filePath}"));

        $offre = $this->offreStageRepository->create([
            'reference' => $reference,
            'intern_id' => $intern->id,
            'application_id' => $application->id,
            'generated_by' => $generator->id,
            'file_path' => $filePath,
        ]);

        $this->auditService->log('generate_offre', $offre);

        return $offre;
    }

    public function all()
    {
        return $this->offreStageRepository->all();
    }

    public function findById(int $id): ?OffreStage
    {
        return $this->offreStageRepository->findById($id);
    }

    public function findByIntern(int $internId): ?OffreStage
    {
        return $this->offreStageRepository->findByIntern($internId);
    }

    public function sendMail(OffreStage $offre): void
    {
        $offre->loadMissing('intern.user');
        Mail::to($offre->intern->user->email)->send(new OffreStageMail($offre));
    }

    public function downloadPath(OffreStage $offre): string
    {
        return storage_path('app/public/' . $offre->file_path);
    }
}
