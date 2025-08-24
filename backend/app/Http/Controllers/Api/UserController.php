<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\AuthUserRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;


class UserController extends Controller
{
    //Funcion store
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

    //Funcion auth
    public function auth(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json([
            'error' => 'Las credenciales no son correctas.',
        ], 401);
    }

    // Crear token de Sanctum
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login exitoso',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => new UserResource($user),
    ]);
}

    //Funcion profile
    public function profile(Request $request)
{
    return response()->json([
        'user' => UserResource::make($request->user()),
    ]);
}

//Funcion updateProfile (no funciona)
public function updateProfile(Request $request)
{
    $user = $request->user();

    $data = $request->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'description' => 'nullable|string|max:500',
        'profile_picture' => 'nullable|image|max:2048',
        'banner_picture' => 'nullable|image|max:4096',
    ]);

    // Guardar archivos si vienen
    if ($request->hasFile('profile_picture')) {
        // Opcional: eliminar imagen anterior
        if ($user->profile_picture) Storage::delete('public/images/users/' . $user->profile_picture);

        $path = $request->file('profile_picture')->store('public/images/users');
        $data['profile_picture'] = basename($path);
    }

    if ($request->hasFile('banner_picture')) {
        if ($user->banner_picture) Storage::delete('public/images/users/' . $user->banner_picture);

        $path = $request->file('banner_picture')->store('public/images/users');
        $data['banner_picture'] = basename($path);
    }

    $user->update($data);

    return response()->json([
        'message' => 'Perfil actualizado correctamente',
        'user' => UserResource::make($user),
    ]);
}

    //Funcion Logout, funciona, pero aun no se implementa en el Frontend
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
                    'message' => 'La sesión ha sido cerrada exitosamente.']);
    }
}
