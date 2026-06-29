<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Inter,Arial,sans-serif;background:#f4f9f5;line-height:1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f9f5;padding:40px 20px;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;box-shadow:0 8px 32px rgba(0,132,61,0.08);overflow:hidden;">
                    <tr>
                        <td style="background:linear-gradient(135deg,#00843D,#02421D);padding:28px 40px 24px;text-align:center;">
                            <h1 style="color:#ffffff;font-size:22px;margin:0;font-weight:600;letter-spacing:-0.3px;">Offre de Stage</h1>
                            <p style="color:rgba(255,255,255,0.8);font-size:13px;margin:6px 0 0;">Plateforme de gestion des stages OCP</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:36px 40px 24px;">
                            <p style="font-size:15px;color:#1a1a1a;margin:0 0 16px;">
                                Bonjour <strong style="color:#00843D;">{{ $offre->intern->user->prenom }} {{ $offre->intern->user->nom }}</strong>,
                            </p>
                            <p style="font-size:14px;color:#555;margin:0 0 20px;line-height:1.7;">
                                Félicitations ! Votre candidature a été acceptée. Veuillez trouver ci-joint votre offre de stage.
                            </p>
                            <p style="font-size:14px;color:#555;margin:0 0 8px;line-height:1.7;">
                                <strong>Référence :</strong> {{ $offre->reference }}
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:16px 0 8px;">
                                        <a href="{{ config('app.url') }}/intern/application" style="display:inline-block;padding:13px 40px;background:linear-gradient(135deg,#00843D,#02421D);color:#ffffff;text-decoration:none;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 4px 16px rgba(0,132,61,0.25);">
                                            Voir mon espace
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 40px 32px;text-align:center;">
                            <p style="font-size:11px;color:#aaa;margin:0;line-height:1.6;">
                                &copy; {{ date('Y') }} Gestion des Stages OCP. Tous droits réservés.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
