<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\InternController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\OffreStageController;
use App\Http\Controllers\QrCodeController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetLink']);
Route::post('/reset-password', [ForgotPasswordController::class, 'reset']);



Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::get('/my-applications', [ApplicationController::class, 'myApplications']);
    Route::apiResource('applications', ApplicationController::class)->only(['index', 'store', 'show']);
    Route::post('/applications/{id}/approve', [ApplicationController::class, 'approve']);
    Route::post('/applications/{id}/reject', [ApplicationController::class, 'reject']);
    Route::post('/applications/{id}/under-review', [ApplicationController::class, 'markUnderReview']);

    Route::get('/interns/my-profile', [InternController::class, 'myProfile']);
    Route::get('/interns', [InternController::class, 'index']);
    Route::get('/interns/{id}', [InternController::class, 'show']);

    Route::get('/attendances/my-attendance', [AttendanceController::class, 'myAttendance']);
    Route::post('/attendance/scan', [AttendanceController::class, 'scan']);
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::get('/attendances/intern/{internId}', [AttendanceController::class, 'internHistory']);

    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/my-report', [ReportController::class, 'myReport']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::get('/reports/intern/{internId}', [ReportController::class, 'internReport']);
    Route::get('/reports/supervisor/all', [ReportController::class, 'supervisorReports']);

    Route::get('/evaluations/my-evaluation', [EvaluationController::class, 'myEvaluation']);
    Route::get('/evaluations', [EvaluationController::class, 'index']);
    Route::post('/evaluations/intern/{internId}', [EvaluationController::class, 'store']);
    Route::get('/evaluations/{id}', [EvaluationController::class, 'show']);
    Route::get('/evaluations/intern/{internId}/result', [EvaluationController::class, 'internEvaluation']);
    Route::put('/evaluations/{id}', [EvaluationController::class, 'update']);

    Route::post('/certificates/generate/{internId}', [CertificateController::class, 'generate']);
    Route::get('/certificates/my-certificate', [CertificateController::class, 'myCertificate']);
    Route::get('/certificates/{id}', [CertificateController::class, 'show']);

    Route::apiResource('departments', DepartmentController::class);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/rh/list', [UserController::class, 'rhUsers']);
    Route::get('/users/supervisors/list', [UserController::class, 'supervisors']);

    Route::get('/dashboard/admin', [DashboardController::class, 'admin']);
    Route::get('/dashboard/rh', [DashboardController::class, 'rh']);
    Route::get('/dashboard/supervisor', [DashboardController::class, 'supervisor']);
    Route::get('/dashboard/intern', [DashboardController::class, 'intern']);

    Route::get('/audit-logs', [AuditLogController::class, 'index']);

    Route::get('/offres-stage/mine', [OffreStageController::class, 'myOffre']);
    Route::get('/offres-stage/mine/download', [OffreStageController::class, 'downloadByIntern']);

    Route::get('/qrcode', [QrCodeController::class, 'show']);

    // Export CSV
    Route::prefix('export')->group(function () {
        Route::get('/users', [ExportController::class, 'users']);
        Route::get('/interns', [ExportController::class, 'interns']);
        Route::get('/interns/excel', [ExportController::class, 'internsExcel']);
        Route::get('/audit-logs', [ExportController::class, 'auditLogs']);
        Route::get('/applications', [ExportController::class, 'applications']);
    });
});




