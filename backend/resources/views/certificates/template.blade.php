<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificat de Stage</title>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: 24px; color: #1a56db; margin-bottom: 5px; }
        .header h2 { font-size: 18px; color: #374151; margin-top: 0; }
        .content { margin: 20px 0; line-height: 1.8; }
        .content p { margin: 10px 0; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 8px 12px; border: 1px solid #d1d5db; }
        .info-table td:first-child { font-weight: bold; width: 40%; background: #f9fafb; }
        .footer { margin-top: 50px; text-align: right; }
        .signature { margin-top: 80px; border-top: 1px solid #374151; display: inline-block; padding-top: 5px; }
        .note-finale { text-align: center; font-size: 16px; font-weight: bold; color: #1a56db; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Certificat de Stage</h1>
        <h2>N° {{ $certificate_number }}</h2>
    </div>

    <div class="content">
        <p>Je soussigné, responsable des stages, certifie que :</p>

        <table class="info-table">
            <tr>
                <td>Nom complet</td>
                <td>{{ $intern->user->nom }} {{ $intern->user->prenom }}</td>
            </tr>
            <tr>
                <td>Département</td>
                <td>{{ $intern->department->name }}</td>
            </tr>
            <tr>
                <td>Encadrant</td>
                <td>{{ $intern->supervisor?->nom }} {{ $intern->supervisor?->prenom }}</td>
            </tr>
            <tr>
                <td>Date de début</td>
                <td>{{ $intern->date_debut->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td>Date de fin</td>
                <td>{{ $intern->date_fin->format('d/m/Y') }}</td>
            </tr>
            <tr>
                <td>Note finale</td>
                <td>{{ $evaluation->note_finale }}/100</td>
            </tr>
        </table>

        <div class="note-finale">
            Note finale : {{ $evaluation->note_finale }}/100
        </div>
    </div>

    <div class="footer">
        <div class="signature">
            Signature RH<br>
            {{ date('d/m/Y') }}
        </div>
    </div>
</body>
</html>


