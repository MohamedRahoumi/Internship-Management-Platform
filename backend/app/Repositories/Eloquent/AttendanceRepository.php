<?php

namespace App\Repositories\Eloquent;

use App\Models\Attendance;
use App\Repositories\Interfaces\AttendanceRepositoryInterface;
use Illuminate\Support\Carbon;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function all(array $filters = [])
    {
        $query = Attendance::with('intern.user', 'scanner');
        if (!empty($filters['intern_id'])) {
            $query->where('intern_id', $filters['intern_id']);
        }
        if (!empty($filters['date'])) {
            $query->whereDate('date', $filters['date']);
        }
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }
        return $query->latest()->get();
    }

    public function findById(int $id): ?Attendance
    {
        return Attendance::with('intern.user', 'scanner')->find($id);
    }

    public function findByIntern(int $internId)
    {
        return Attendance::where('intern_id', $internId)
            ->with('scanner')
            ->latest()
            ->get();
    }

    public function findTodayAttendance(int $internId): ?Attendance
    {
        return Attendance::where('intern_id', $internId)
            ->whereDate('date', Carbon::today())
            ->latest()
            ->first();
    }

    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        $attendance->update($data);
        return $attendance->fresh();
    }

    public function delete(Attendance $attendance): bool
    {
        return $attendance->delete();
    }

    public function paginate(array $filters = [], int $perPage = 15)
    {
        $query = Attendance::with('intern.user', 'scanner');
        if (!empty($filters['intern_id'])) {
            $query->where('intern_id', $filters['intern_id']);
        }
        if (!empty($filters['date'])) {
            $query->whereDate('date', $filters['date']);
        }
        return $query->latest()->paginate($perPage);
    }
}


