<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Inter, Arial, sans-serif; background: #f4f9f5; line-height: 1.6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f9f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border-radius: 20px; box-shadow: 0 8px 32px rgba(0,132,61,0.08); overflow: hidden;">
                    <!-- Header OCP -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #00843D, #02421D); padding: 28px 40px 24px; text-align: center;">
                            <img src="https://upload.wikimedia.org/wikipedia/fr/thumb/5/5d/Logo_OCP_%282019%29.svg/1200px-Logo_OCP_%282019%29.svg.png" alt="OCP" width="100" style="display: inline-block; margin-bottom: 8px;" />
                            <h1 style="color: #ffffff; font-size: 22px; margin: 4px 0 0; font-weight: 600; letter-spacing: -0.3px;">Bienvenue sur Stagaire</h1>
                            <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 4px 0 0;">Plateforme de gestion des stages OCP</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 36px 40px 24px;">
                            <p style="font-size: 15px; color: #1a1a1a; margin: 0 0 16px;">
                                Bonjour <strong style="color: #00843D;">{{ $user->prenom }} {{ $user->nom }}</strong>,
                            </p>
                            <p style="font-size: 14px; color: #555; margin: 0 0 20px; line-height: 1.7;">
                                Votre compte a été créé avec succès. Voici vos identifiants de connexion :
                            </p>

                            <!-- Credentials Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f9f5; border-radius: 14px; border: 1px solid rgba(0,132,61,0.08); margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 18px 20px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="30" valign="top" style="padding: 2px 0 0;">
                                                    <span style="display: inline-block; width: 28px; height: 28px; background: #00843D; border-radius: 8px; text-align: center; line-height: 28px; color: #fff; font-size: 13px;">@</span>
                                                </td>
                                                <td style="padding-left: 12px;">
                                                    <p style="font-size: 11px; color: #888; margin: 0 0 2px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                                                    <p style="font-size: 14px; color: #1a1a1a; margin: 0; font-weight: 600;">{{ $user->email }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 0 20px 4px;"><hr style="border: none; border-top: 1px solid rgba(0,132,61,0.06); margin: 0;"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 20px 18px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="30" valign="top" style="padding: 2px 0 0;">
                                                    <span style="display: inline-block; width: 28px; height: 28px; background: #02421D; border-radius: 8px; text-align: center; line-height: 28px; color: #fff; font-size: 13px;">&#128273;</span>
                                                </td>
                                                <td style="padding-left: 12px;">
                                                    <p style="font-size: 11px; color: #888; margin: 0 0 2px; text-transform: uppercase; letter-spacing: 0.5px;">Mot de passe</p>
                                                    <p style="font-size: 14px; color: #00843D; margin: 0; font-weight: 700; letter-spacing: 1.5px; font-family: 'Courier New', monospace;">{{ $plainPassword }}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 8px;">
                                        <a href="{{ config('app.url') }}" style="display: inline-block; padding: 13px 40px; background: linear-gradient(135deg, #00843D, #02421D); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 4px 16px rgba(0,132,61,0.25);">Se connecter</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 0 40px 32px; text-align: center;">
                            <p style="font-size: 11px; color: #aaa; margin: 0; line-height: 1.6;">
                                Cet email est généré automatiquement, merci de ne pas y répondre.<br>
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
