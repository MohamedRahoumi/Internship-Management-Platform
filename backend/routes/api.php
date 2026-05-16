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
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

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

    Route::post('/attendance/scan', [AttendanceController::class, 'scan']);
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::get('/attendances/intern/{internId}', [AttendanceController::class, 'internHistory']);

    Route::post('/reports', [ReportController::class, 'store']);
    Route::get('/reports/my-report', [ReportController::class, 'myReport']);
    Route::get('/reports/{id}', [ReportController::class, 'show']);
    Route::get('/reports/intern/{internId}', [ReportController::class, 'internReport']);

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
});




