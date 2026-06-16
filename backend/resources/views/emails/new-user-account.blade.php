<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Bienvenue sur Stagaire</h2>
        <p>Bonjour <strong>{{ $user->prenom }} {{ $user->nom }}</strong>,</p>
        <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion :</p>
        <table style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0; width: 100%;">
            <tr>
                <td style="font-weight: bold; padding: 4px 0;">Email :</td>
                <td style="padding: 4px 0;">{{ $user->email }}</td>
            </tr>
            <tr>
                <td style="font-weight: bold; padding: 4px 0;">Mot de passe :</td>
                <td style="padding: 4px 0;">{{ $plainPassword }}</td>
            </tr>
        </table>
        <p>Vous pouvez vous connecter à l'adresse suivante :</p>
        <p><a href="{{ config('app.url') }}" style="display: inline-block; padding: 10px 20px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px;">Se connecter</a></p>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">Cet email est généré automatiquement, merci de ne pas y répondre.</p>
    </div>
</body>
</html>
