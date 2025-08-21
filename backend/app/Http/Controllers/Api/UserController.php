<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\AuthUserRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;


class UserController extends Controller
{
        public function store(StoreUserRequest $request){
            $data = $request->validated();
            $data['password'] = bcrypt($data['password']); // Encriptar la contraseña
            $user = User::create($data);
                    return response()->json(['message' => 'Su cuenta ha sido creada exitosamente.']);

    }

    public function auth(AuthUserRequest $request){
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'error' => 'Credenciales incorrectas.'
        ], 401);
    }

    // Crear token personal de acceso
    $token = $user->createToken('user_token')->plainTextToken;

    return response()->json([
        'user' => UserResource::make($user),
        'access_token' => $token,
        'message' => 'Bienvenido.'
    ]);
}

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
                    'message' => 'La sesión ha sido cerrada exitosamente.']);
    }
}
