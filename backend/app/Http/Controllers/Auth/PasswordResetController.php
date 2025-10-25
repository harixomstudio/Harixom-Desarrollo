<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use App\Services\BrevoMailer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PasswordResetController extends Controller
{
    // Enviar link al correo
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();


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

        $token = Password::createToken($user);

        $resetUrl = env('FRONTEND_URL') 
        . "/ResetPassword?token=" . urlencode($token) 
        . "&email=" . urlencode($user->email);

        try {
            BrevoMailer::send($user->email, "Restablecer contraseña", "
            <h2>Hola {$user->name}</h2>
            <h4>Este es un correo de restablecimiento de contraseña de Harixom </h4>
            <p>Haz clic aquí para restablecer tu contraseña:</p>
            <a href='{$resetUrl}'>Restablecer contraseña</a>
            <p>Si no has solicitado un restablecimiento de contraseña, puedes ignorar este correo.</p>
            <p>Atentamente, el equipo de Harixom</p>

        ");
        } catch (\Exception $e) {
            Log::error('Error al enviar correo en Notification: ' . $e->getMessage());
        }

        
        return response()->json([
            'message' => 'Se ha enviado un correo para restablecer la contraseña.'
        ], 200);
    }


    // Resetear contraseña con el token
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)], 200)
            : response()->json(['error' => __($status)], 400);
    }
}
