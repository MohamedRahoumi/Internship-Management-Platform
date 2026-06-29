<?php

namespace App\Providers;

use App\Models\InternshipApplication;
use App\Policies\InternshipApplicationPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        require_once __DIR__ . '/../Helpers/helpers.php';
    }

    public function boot(): void
    {
        Gate::policy(InternshipApplication::class, InternshipApplicationPolicy::class);
    }
}
