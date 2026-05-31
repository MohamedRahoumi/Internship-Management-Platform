<?php

namespace App\Services;

use App\Models\InternshipReport;
use App\Repositories\Interfaces\ReportRepositoryInterface;
use Illuminate\Http\UploadedFile;

class ReportService
{
    public function __construct(
        private readonly ReportRepositoryInterface $reportRepository,
    ) {}

    public function submit(int $internId, array $data, ?UploadedFile $file): InternshipReport
    {
        if ($file) {
            $path = $file->store('reports', 'public');
            $data['file_path'] = $path;
        }

        $data['intern_id'] = $internId;
        $data['status'] = 'submitted';

        return $this->reportRepository->create($data);
    }

    public function findByIntern(int $internId): ?InternshipReport
    {
        return $this->reportRepository->findByIntern($internId);
    }

    public function findById(int $id): ?InternshipReport
    {
        return $this->reportRepository->findById($id);
    }

    public function updateStatus(int $id, string $status): InternshipReport
    {
        $report = $this->reportRepository->findById($id);
        if (!$report) {
            throw new \RuntimeException('Rapport introuvable.');
        }
        return $this->reportRepository->update($report, ['status' => $status]);
    }
}


