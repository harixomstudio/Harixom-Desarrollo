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
    $data['password'] = bcrypt($data['password']);
    $user = User::create($data);

    if ($request->wantsJson()) {
        return response()->json([
            'user' => $user,
            'message' => 'Usuario creado correctamente.'
        ], 201);
    }

    return redirect()->route('admin.index')->with('success', 'Usuario creado correctamente.');
}

    public function auth(AuthUserRequest $request){
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'error' => 'Credenciales incorrectas.'
        ], 401);
    }

    // Validar si el usuario está activo
    if (!$user->is_active) {
        return response()->json([
            'error' => 'Tu cuenta está inactiva. Contacta al administrador.'
        ], 403);
    }

    // Crear token personal de acceso
    $token = $user->createToken('user_token')->plainTextToken;

    return response()->json([
        'user' => UserResource::make($user),
        'access_token' => $token,
        'message' => 'Bienvenido.'
    ]);
}

    //
    public function profile(Request $request)
{
    return response()->json([
        'user' => UserResource::make($request->user()),
    ]);
}

//
public function updateProfile(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'name' => 'sometimes|string|max:255',
        'phone' => 'sometimes|string|max:20',
        'address' => 'sometimes|string|max:255',
        'description' => 'sometimes|string|max:500',
        'profile_picture' => 'sometimes|image|max:2048',
        'banner_picture' => 'sometimes|image|max:4096',
    ]);

    // Si vienen archivos, guardarlos
    if ($request->hasFile('profile_picture')) {
        $path = $request->file('profile_picture')->store('public/images/users');
        $data['profile_picture'] = basename($path);
    }

    if ($request->hasFile('banner_picture')) {
        $path = $request->file('banner_picture')->store('public/images/users');
        $data['banner_picture'] = basename($path);
    }

    $user->update($data);

    return response()->json([
        'message' => 'Perfil actualizado correctamente',
        'user' => UserResource::make($user),
    ]);
}

    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
                    'message' => 'La sesión ha sido cerrada exitosamente.']);
    }
}
