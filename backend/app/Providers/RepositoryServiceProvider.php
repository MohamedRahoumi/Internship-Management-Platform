<?php

namespace App\Providers;

use App\Repositories\Eloquent\ApplicationRepository;
use App\Repositories\Eloquent\AttendanceRepository;
use App\Repositories\Eloquent\CertificateRepository;
use App\Repositories\Eloquent\DepartmentRepository;
use App\Repositories\Eloquent\EvaluationRepository;
use App\Repositories\Eloquent\InternRepository;
use App\Repositories\Eloquent\ReportRepository;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Interfaces\ApplicationRepositoryInterface;
use App\Repositories\Interfaces\AttendanceRepositoryInterface;
use App\Repositories\Interfaces\CertificateRepositoryInterface;
use App\Repositories\Interfaces\DepartmentRepositoryInterface;
use App\Repositories\Interfaces\EvaluationRepositoryInterface;
use App\Repositories\Interfaces\InternRepositoryInterface;
use App\Repositories\Interfaces\ReportRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(DepartmentRepositoryInterface::class, DepartmentRepository::class);
        $this->app->bind(ApplicationRepositoryInterface::class, ApplicationRepository::class);
        $this->app->bind(InternRepositoryInterface::class, InternRepository::class);
        $this->app->bind(AttendanceRepositoryInterface::class, AttendanceRepository::class);
        $this->app->bind(ReportRepositoryInterface::class, ReportRepository::class);
        $this->app->bind(EvaluationRepositoryInterface::class, EvaluationRepository::class);
        $this->app->bind(CertificateRepositoryInterface::class, CertificateRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
