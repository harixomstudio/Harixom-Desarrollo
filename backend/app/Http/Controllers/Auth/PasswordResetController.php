<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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

    $status = Password::sendResetLink($request->only('email'));

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => __($status)], 200)
        : response()->json(['error' => __($status)], 400);
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
