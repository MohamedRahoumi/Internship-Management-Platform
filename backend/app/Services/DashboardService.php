<?php

namespace App\Services;

use App\Enums\ApplicationStatus;
use App\Enums\UserRole;
use App\Models\InternshipApplication;
use App\Models\User;
use App\Models\Intern;
use App\Models\Attendance;
use App\Models\Department;

class DashboardService
{
    public function adminDashboard(): array
    {
        return [
            'rh_count' => User::where('role', UserRole::RH->value)->count(),
            'supervisor_count' => User::where('role', UserRole::Supervisor->value)->count(),
            'intern_count' => Intern::count(),
            'department_count' => Department::count(),
            'applications_pending' => InternshipApplication::where('status', ApplicationStatus::Pending->value)->count(),
            'applications_approved' => InternshipApplication::where('status', ApplicationStatus::Approved->value)->count(),
            'applications_rejected' => InternshipApplication::where('status', ApplicationStatus::Rejected->value)->count(),
            'active_interns' => Intern::where('status', 'active')->count(),
            'recent_audit_logs' => \App\Models\AuditLog::with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn ($log) => [
                    'id' => $log->id,
                    'user' => $log->user ? "{$log->user->nom} {$log->user->prenom}" : 'Système',
                    'action' => $log->action,
                    'model_type' => class_basename($log->model_type ?? ''),
                    'created_at' => $log->created_at->diffForHumans(),
                ]),
        ];
    }

    public function rhDashboard(): array
    {
        return [
            'pending_applications' => InternshipApplication::where('status', ApplicationStatus::Pending->value)->count(),
            'approved_applications' => InternshipApplication::where('status', ApplicationStatus::Approved->value)->count(),
            'rejected_applications' => InternshipApplication::where('status', ApplicationStatus::Rejected->value)->count(),
            'active_interns' => Intern::where('status', 'active')->count(),
            'total_attendances' => Attendance::count(),
            'today_attendances' => Attendance::whereDate('created_at', today())->count(),
        ];
    }

    public function supervisorDashboard(int $userId): array
    {
        $interns = Intern::where('supervisor_id', $userId)->get();
        $internIds = $interns->pluck('id');

        return [
            'my_interns_count' => $interns->count(),
            'active_interns' => $interns->where('status', 'active')->count(),
            'total_attendances' => Attendance::whereIn('intern_id', $internIds)->count(),
            'reports_submitted' => \App\Models\InternshipReport::whereIn('intern_id', $internIds)->count(),
            'evaluations_done' => \App\Models\Evaluation::whereIn('intern_id', $internIds)->count(),
        ];
    }

    public function internDashboard(int $userId): array
    {
        $intern = Intern::where('user_id', $userId)->first();

        if (!$intern) {
            return [
                'has_application' => false,
                'status' => null,
            ];
        }

        return [
            'has_application' => true,
            'status' => $intern->status,
            'attendances_count' => $intern->attendances()->count(),
            'has_report' => $intern->report !== null,
            'has_evaluation' => $intern->evaluation !== null,
            'has_certificate' => $intern->certificate !== null,
            'intern' => $intern->load('user', 'department', 'supervisor', 'attendances', 'report', 'evaluation', 'certificate'),
        ];
    }
}






