<?php

namespace App\Repositories\Interfaces;

use App\Models\Attendance;

interface AttendanceRepositoryInterface
{
    public function all(array $filters = []);
    public function findById(int $id): ?Attendance;
    public function findByIntern(int $internId);
    public function findTodayAttendance(int $internId): ?Attendance;
    public function create(array $data): Attendance;
    public function update(Attendance $attendance, array $data): Attendance;
    public function delete(Attendance $attendance): bool;
    public function paginate(array $filters = [], int $perPage = 15);
}
