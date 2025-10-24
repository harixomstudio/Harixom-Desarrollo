<?php

use App\Notifications\ResetPasswordNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;

class PasswordResetController extends Controller
{
    // Enviar link al correo
    public function sendResetLink(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = \App\Models\User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'No se encontró un usuario con ese correo.'
            ], 404);
        }

        if (!$user->is_active) {
            return response()->json([
                'error' => 'Tu cuenta está inactiva. No se puede restablecer la contraseña.'
            ], 403);
        }

        // Generar token
        $token = Password::createToken($user);

        // Enviar correo usando Brevo directamente
        $notification = new ResetPasswordNotification($token, $user->email);
        $sent = $notification->sendResetEmail();

        if (!$sent) {
            return response()->json([
                'error' => 'Error al enviar el correo. Intenta más tarde.'
            ], 500);
        }

        return response()->json([
            'message' => 'Se envió el enlace de restablecimiento de contraseña a tu correo.'
        ], 200);
    }
}
