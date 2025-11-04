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
            $htmlContent = "
        <div style=' background-color: #0c0a09;  padding: 30px; font-family: Arial, Helvetica, sans-serif; color: white; border-radius: 10px;'>
        <div style=' max-width: 600px; margin: auto;  background-color: #202020; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px;'>
            <div style='text-align: center;'>
                <h2 style='color: #f6339a;'>Hola {$user->name}</h2>
                <h4>Restablecimiento de contraseña - Harixom</h4>
            </div>

            <p style='font-size: 16px; line-height: 1.6;'>
                Hemos recibido una solicitud para restablecer tu contraseña.
                Si fuiste tú quien la solicitó, haz clic en el botón de abajo.
            </p>

            <div style='text-align: center; margin: 30px 0;'>
                <a href='{$resetUrl}' 
                   style=' background-color: #f6339a; color: white;  padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>
                   Restablecer contraseña
                </a>
            </div>

            <p style='font-size: 15px; color: #ffff;'>
                Si no has solicitado un restablecimiento, puedes ignorar este mensaje.
            </p>

            <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>

            <p style='text-align: center; color: #999; font-size: 13px;'>
                &copy; " . date('Y') . " Harixom. Todos los derechos reservados.
            </p>
        </div>
    </div>
    ";

            BrevoMailer::send(
                $user->email,
                "Restablecer contraseña",
                $htmlContent
            );
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
