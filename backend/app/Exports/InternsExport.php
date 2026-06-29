<?php

namespace App\Exports;

use App\Models\Intern;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class InternsExport implements FromCollection, WithHeadings, WithMapping, WithColumnWidths, WithStyles
{
    public function collection()
    {
        return Intern::with('user', 'department', 'supervisor', 'evaluation', 'certificate')->latest()->get();
    }

    public function headings(): array
    {
        return [
            'Stagiaire',
            'Email',
            'CIN',
            'Téléphone',
            'Département',
            'Superviseur',
            'Date début',
            'Date fin',
            'Statut',
            'Évaluation',
            'Certificat',
        ];
    }

    public function map($intern): array
    {
        return [
            ($intern->user->prenom ?? '') . ' ' . ($intern->user->nom ?? ''),
            $intern->user->email ?? '',
            $intern->user->cin ?? '',
            $intern->user->telephone ?? '',
            $intern->department->name ?? '',
            $intern->supervisor ? ($intern->supervisor->prenom . ' ' . $intern->supervisor->nom) : '',
            $intern->date_debut ? $intern->date_debut->format('d/m/Y') : '',
            $intern->date_fin ? $intern->date_fin->format('d/m/Y') : '',
            match ($intern->status) {
                'active' => 'Actif',
                'completed' => 'Terminé',
                'suspended' => 'Suspendu',
                default => $intern->status ?? '',
            },
            $intern->evaluation ? 'Oui' : 'Non',
            $intern->certificate ? 'Oui' : 'Non',
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 30,
            'B' => 30,
            'C' => 15,
            'D' => 15,
            'E' => 20,
            'F' => 25,
            'G' => 15,
            'H' => 15,
            'I' => 12,
            'J' => 12,
            'K' => 12,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
