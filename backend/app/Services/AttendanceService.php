<?php

namespace App\Services;

use App\Enums\AttendanceStatus;
use App\Models\Attendance;
use App\Models\Intern;
use App\Models\User;
use App\Repositories\Interfaces\AttendanceRepositoryInterface;
use App\Repositories\Interfaces\InternRepositoryInterface;
use Illuminate\Support\Carbon;

class AttendanceService
{
    public function __construct(
        private readonly AttendanceRepositoryInterface $attendanceRepository,
        private readonly InternRepositoryInterface $internRepository,
        private readonly AuditService $auditService,
    ) {}

    public function scan(string $qrToken, User $scanner): Attendance
    {
        $intern = $this->internRepository->findByQrToken($qrToken);

        if (!$intern) {
            throw new \RuntimeException('QR Code invalide.');
        }

        if ($intern->status !== 'active') {
            throw new \RuntimeException('Le stage de ce stagiaire n\'est pas actif.');
        }

        $todayAttendance = $this->attendanceRepository->findTodayAttendance($intern->id);

        if (!$todayAttendance) {
            $attendance = $this->attendanceRepository->create([
                'intern_id' => $intern->id,
                'scanned_by' => $scanner->id,
                'check_in_at' => now(),
                'date' => Carbon::today(),
                'qr_token' => $qrToken,
                'status' => AttendanceStatus::CheckedIn->value,
            ]);
            $this->auditService->log('scan', $attendance, null, ['action' => 'check_in', 'intern' => $intern->user->nom]);
            return $attendance->load('intern.user');
        }

        if ($todayAttendance->status === AttendanceStatus::CheckedOut->value) {
            throw new \RuntimeException('Vous avez déjà effectué le check-out aujourd\'hui.');
        }

        return tap($this->attendanceRepository->update($todayAttendance, [
            'check_out_at' => now(),
            'status' => AttendanceStatus::CheckedOut->value,
        ]), fn($a) => $a->load('intern.user'));
    }

    public function findByIntern(int $internId)
    {
        return $this->attendanceRepository->findByIntern($internId);
    }

    public function all(array $filters = [])
    {
        return $this->attendanceRepository->paginate($filters);
    }
}




