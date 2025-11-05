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



    public function changePassword(Request $request)
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
            . "/ChangePassword?token=" . urlencode($token);

        try {
            $htmlContent = "
        <div style=' background-color: #0c0a09;  padding: 30px; font-family: Arial, Helvetica, sans-serif; color: white; border-radius: 10px;'>
        <div style=' max-width: 600px; margin: auto;  background-color: #202020; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px;'>
            <div style='text-align: center;'>
                <h2 style='color: #f6339a;'>Hi {$user->name}</h2>
                <h4>Change Password Request - Harixom</h4>
            </div>

            <p style='font-size: 16px; line-height: 1.6;'>
               We received a request to change your password. 
               If you made this request, you can reset your password by clicking the button below.
            </p>

            <div style='text-align: center; margin: 30px 0;'>
                <a href='{$resetUrl}' 
                   style=' background-color: #f6339a; color: white;  padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;'>
                   Change Password
                </a>
            </div>

            <p style='font-size: 15px; color: #ffff;'>
                If you did not request a password change, you can ignore this message.
            </p>

            <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>

            <p style='text-align: center; color: #999; font-size: 13px;'>
                &copy; " . date('Y') . " Harixom. All rights reserved.
            </p>
        </div>
    </div>
    ";

            BrevoMailer::send(
                $user->email,
                "Change Password Request",
                $htmlContent
            );
        } catch (\Exception $e) {
            Log::error('Error to send email: ' . $e->getMessage());
        }


        return response()->json([
            'message' => 'Send email successfully'
        ], 200);
    }

    public function change(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'old_password' => 'required|min:6',
            'new_password' => 'required|min:6|different:old_password',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'No se encontró un usuario con ese correo.'
            ], 404);
        }

        if (Hash::check($request->old_password, $user->password)) {
            $user->password = Hash::make($request->new_password);
            $user->save();
        } else {
            return response()->json(['error' => 'La contraseña actual es incorrecta.'], 400);
        }

        return response()->json([
            'message' => 'Password changed successfully'
        ], 200);
    }
}
