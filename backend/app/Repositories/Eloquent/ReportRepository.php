<?php

namespace App\Repositories\Eloquent;

use App\Models\InternshipReport;
use App\Repositories\Interfaces\ReportRepositoryInterface;

class ReportRepository implements ReportRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = InternshipReport::with('intern.user');
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        if (!empty($filters['intern_id'])) {
            $query->where('intern_id', $filters['intern_id']);
        }
        return $query->latest()->get();
    }

    public function findById(int $id): ?InternshipReport
    {
        return InternshipReport::with('intern.user', 'intern.department')->find($id);
    }

    public function findByIntern(int $internId): ?InternshipReport
    {
        return InternshipReport::where('intern_id', $internId)->first();
    }

    public function findBySupervisor(int $supervisorId)
    {
        return InternshipReport::whereHas('intern', function ($q) use ($supervisorId) {
            $q->where('supervisor_id', $supervisorId);
        })->with('intern.user', 'intern.department')->latest()->get();
    }

    public function create(array $data): InternshipReport
    {
        return InternshipReport::create($data);
    }

    public function update(InternshipReport $report, array $data): InternshipReport
    {
        $report->update($data);
        return $report->fresh();
    }

    public function delete(InternshipReport $report): bool
    {
        return $report->delete();
    }
}


