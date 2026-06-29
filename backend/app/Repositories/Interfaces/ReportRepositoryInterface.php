<?php

namespace App\Repositories\Interfaces;

use App\Models\InternshipReport;

interface ReportRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?InternshipReport;
    public function findByIntern(int $internId): ?InternshipReport;
    public function findBySupervisor(int $supervisorId);
    public function create(array $data): InternshipReport;
    public function update(InternshipReport $report, array $data): InternshipReport;
    public function delete(InternshipReport $report): bool;
}
