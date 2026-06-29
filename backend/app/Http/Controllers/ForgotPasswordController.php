<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();
        $token = Str::random(60);

        $user->update(['remember_token' => $token]);

        try {
            Mail::send('emails.reset-password', ['user' => $user, 'token' => $token], function ($msg) use ($user) {
                $msg->to($user->email)->subject('Réinitialisation de mot de passe');
            });
        } catch (\Throwable $e) {
            return response()->json(['message' => "Erreur lors de l'envoi de l'email."], 500);
        }

        return response()->json(['message' => 'Email de réinitialisation envoyé.']);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->remember_token !== $request->token) {
            return response()->json(['message' => 'Token invalide.'], 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'remember_token' => null,
        ]);

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }
}
