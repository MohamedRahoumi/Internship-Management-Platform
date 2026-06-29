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
            'total_applications' => InternshipApplication::count(),
            'pending_applications' => InternshipApplication::where('status', ApplicationStatus::Pending->value)->count(),
            'approved_applications' => InternshipApplication::whereIn('status', [ApplicationStatus::Approved->value, ApplicationStatus::Active->value])->count(),
            'rejected_applications' => InternshipApplication::where('status', ApplicationStatus::Rejected->value)->count(),
            'active_interns' => Intern::where('status', 'active')->count(),
            'total_attendances' => Attendance::count(),
            'today_attendances' => Attendance::whereDate('created_at', today())->count(),
            'recent_applications' => InternshipApplication::with('user')
                ->latest()
                ->take(10)
                ->get()
                ->map(fn ($app) => [
                    'id' => $app->id,
                    'user' => $app->user ? "{$app->user->prenom} {$app->user->nom}" : 'Inconnu',
                    'email' => $app->user?->email ?? '—',
                    'status' => $app->status->value,
                    'created_at' => $app->created_at->diffForHumans(),
                ]),
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
        $user = User::find($userId);
        $intern = Intern::where('user_id', $userId)->first();
        $application = InternshipApplication::where('user_id', $userId)->first();

        $hasActiveInternship = $user?->hasActiveInternship() ?? false;

        if ($intern) {
            return [
                'has_application' => true,
                'application_status' => $application?->status?->value ?? 'active',
                'status' => $intern->status,
                'attendances_count' => $intern->attendances()->count(),
                'has_report' => $intern->report !== null,
                'has_evaluation' => $intern->evaluation !== null,
                'has_certificate' => $intern->certificate !== null,
                'has_offre' => $intern->offreStage !== null,
                'intern' => $intern->load('user', 'department', 'supervisor', 'attendances', 'report', 'evaluation', 'certificate', 'offreStage'),
                'rejection_reason' => null,
                'has_active_internship' => $hasActiveInternship,
            ];
        }

        if ($application) {
            return [
                'has_application' => true,
                'application_status' => $application->status->value,
                'status' => $application->status->value,
                'attendances_count' => 0,
                'has_report' => false,
                'has_evaluation' => false,
                'has_certificate' => false,
                'has_offre' => false,
                'intern' => null,
                'rejection_reason' => $application->status === ApplicationStatus::Rejected ? $application->motif_refus : null,
                'has_active_internship' => $hasActiveInternship,
            ];
        }

        return [
            'has_application' => false,
            'application_status' => null,
            'status' => null,
            'attendances_count' => 0,
            'has_report' => false,
            'has_evaluation' => false,
            'has_certificate' => false,
            'has_offre' => false,
            'intern' => null,
            'rejection_reason' => null,
            'has_active_internship' => false,
        ];
    }
}






