<?php

namespace App\Http\Controllers;

use App\Exports\InternsExport;
use App\Models\User;
use App\Models\Intern;
use App\Models\AuditLog;
use App\Models\Department;
use App\Models\InternshipApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function users(Request $request)
    {
        $query = User::query()->with('department');
        if ($request->role) $query->where('role', $request->role);
        if ($request->department_id) $query->where('department_id', $request->department_id);
        if ($request->search) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('nom', 'like', "%{$s}%")->orWhere('prenom', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%");
            });
        }
        $users = $query->get();

        $roleLabels = ['administrator' => 'Admin', 'rh' => 'RH', 'supervisor' => 'Encadrant', 'intern' => 'Stagiaire'];
        $headers = [['Nom', 'Prénom', 'Email', 'Rôle', 'Département', 'Téléphone', 'CIN', 'Actif', 'Créé le']];
        $rows = $users->map(fn ($u) => [
            $u->nom ?? '', $u->prenom ?? '', $u->email ?? '',
            $roleLabels[$u->role] ?? $u->role,
            $u->department->name ?? '',
            $u->telephone ?? '', $u->cin ?? '',
            $u->is_active ? 'Oui' : 'Non',
            $u->created_at->format('d/m/Y'),
        ])->toArray();

        return $this->csv('utilisateurs', array_merge($headers, $rows));
    }

    public function interns()
    {
        $interns = Intern::with('user', 'department', 'supervisor')->get();
        $headers = [['Stagiaire', 'Email', 'CIN', 'Département', 'Superviseur', 'Date début', 'Date fin', 'Statut']];
        $rows = $interns->map(fn ($i) => [
            ($i->user->prenom ?? '') . ' ' . ($i->user->nom ?? ''),
            $i->user->email ?? '',
            $i->user->cin ?? '',
            $i->department->name ?? '',
            $i->supervisor ? ($i->supervisor->prenom . ' ' . $i->supervisor->nom) : '',
            $i->date_debut ? $i->date_debut->format('d/m/Y') : '',
            $i->date_fin ? $i->date_fin->format('d/m/Y') : '',
            $i->status ?? '',
        ])->toArray();

        return $this->csv('stagiaires', array_merge($headers, $rows));
    }

    public function internsExcel(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        return Excel::download(new InternsExport, 'stagiaires-' . date('Y-m-d') . '.xlsx');
    }

    public function auditLogs()
    {
        $logs = AuditLog::with('user')->latest()->get();
        $actionLabels = ['login' => 'Connexion', 'logout' => 'Déconnexion', 'create' => 'Création', 'update' => 'Modification', 'delete' => 'Suppression', 'approve' => 'Approbation', 'reject' => 'Rejet', 'generate' => 'Génération', 'scan' => 'Scan QR'];
        $headers = [['Utilisateur', 'Email', 'Action', 'Module', 'Date']];
        $rows = $logs->map(fn ($l) => [
            $l->user ? ($l->user->prenom . ' ' . $l->user->nom) : 'Système',
            $l->user->email ?? '',
            $actionLabels[$l->action] ?? $l->action,
            class_basename($l->model_type ?? ''),
            $l->created_at->format('d/m/Y H:i'),
        ])->toArray();

        return $this->csv('journal-audit', array_merge($headers, $rows));
    }

    public function applications()
    {
        $apps = InternshipApplication::with('user')->latest()->get();
        $statusLabels = ['pending' => 'En attente', 'approved' => 'Approuvée', 'rejected' => 'Refusée'];
        $headers = [['Candidat', 'Email', 'Téléphone', 'Statut', 'Date']];
        $rows = $apps->map(fn ($a) => [
            $a->user ? ($a->user->prenom . ' ' . $a->user->nom) : '',
            $a->user->email ?? '',
            $a->user->telephone ?? '',
            $statusLabels[$a->status->value ?? ''] ?? $a->status->value ?? '',
            $a->created_at->format('d/m/Y'),
        ])->toArray();

        return $this->csv('candidatures', array_merge($headers, $rows));
    }

    private function csv(string $filename, array $rows): \Illuminate\Http\Response
    {
        $handle = fopen('php://temp', 'r+');
        foreach ($rows as $row) {
            fputcsv($handle, $row, ';');
        }
        rewind($handle);
        $content = stream_get_contents($handle);
        fclose($handle);

        return Response::make("\xEF\xBB\xBF" . $content, 200, [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}-" . date('Y-m-d') . ".csv\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ]);
    }
}
