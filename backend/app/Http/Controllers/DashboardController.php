<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService,
    ) {}

    public function admin(): JsonResponse
    {
        return response()->json($this->dashboardService->adminDashboard());
    }

    public function rh(): JsonResponse
    {
        return response()->json($this->dashboardService->rhDashboard());
    }

    public function supervisor(Request $request): JsonResponse
    {
        return response()->json($this->dashboardService->supervisorDashboard($request->user()->id));
    }

    public function intern(Request $request): JsonResponse
    {
        return response()->json($this->dashboardService->internDashboard($request->user()->id));
    }
}


