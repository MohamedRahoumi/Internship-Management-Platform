<?php

namespace App\Services;

use App\Models\Certificate;
use App\Models\User;
use App\Repositories\Interfaces\CertificateRepositoryInterface;
use App\Repositories\Interfaces\InternRepositoryInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class CertificateService
{
    public function __construct(
        private readonly CertificateRepositoryInterface $certificateRepository,
        private readonly InternRepositoryInterface $internRepository,
        private readonly AuditService $auditService,
    ) {}

    public function generate(int $internId, User $generator): Certificate
    {
        $intern = $this->internRepository->findById($internId);

        if (!$intern) {
            throw new \RuntimeException('Stagiaire introuvable.');
        }

        if (!$intern->evaluation) {
            throw new \RuntimeException('Le stagiaire doit avoir une évaluation pour générer un certificat.');
        }

        $certificateNumber = 'CERT-' . strtoupper(Str::random(8));

        $data = [
            'intern' => $intern->load('user', 'department', 'supervisor'),
            'evaluation' => $intern->evaluation,
            'certificate_number' => $certificateNumber,
        ];

        $pdf = Pdf::loadView('certificates.template', $data);
        $filePath = "certificates/{$certificateNumber}.pdf";
        $pdf->save(storage_path("app/public/{$filePath}"));

        $certificate = $this->certificateRepository->create([
            'intern_id' => $internId,
            'evaluation_id' => $intern->evaluation->id,
            'generated_by' => $generator->id,
            'certificate_number' => $certificateNumber,
            'file_path' => $filePath,
        ]);

        $this->auditService->log('generate', $certificate);

        return $certificate;
    }

    public function findByIntern(int $internId): ?Certificate
    {
        return $this->certificateRepository->findByIntern($internId);
    }

    public function findById(int $id): ?Certificate
    {
        return $this->certificateRepository->findById($id);
    }
}




