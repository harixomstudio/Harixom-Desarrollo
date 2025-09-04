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

    // Guardar imagen de perfil
    if ($request->hasFile('profile_picture')) {
        $file = $request->file('profile_picture');
        $filename = time().'_profile_'.$file->getClientOriginalName();
        $file->move(public_path('images/users'), $filename);
        $data['profile_picture'] = $filename;
    }

    // Guardar banner
    if ($request->hasFile('banner_picture')) {
        $file = $request->file('banner_picture');
        $filename = time().'_banner_'.$file->getClientOriginalName();
        $file->move(public_path('images/users'), $filename);
        $data['banner_picture'] = $filename;
    }

    $user = User::create($data);

    return response()->json([
        'user' => new UserResource($user),
        'message' => 'Usuario creado correctamente.'
    ], 201);
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

    // Validar si el usuario está habilitado
    if (!$user->is_active) {
        return response()->json([
            'error' => 'Tu cuenta ha sido deshabilitada, contacta con soporte.',
        ], 403);
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

//Funcion updateProfile
public function updateProfile(Request $request)
{
    $user = $request->user();

    Log::info("Usuario autenticado", $user->toArray());
    Log::info("Request completo", $request->all());

    $data = $request->validate([
        'name' => 'nullable|string|max:255',
        'email' => 'nullable|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
        'address' => 'nullable|string|max:255',
        'description' => 'nullable|string|max:500',
        'profile_picture' => 'nullable|image|max:2048',
        'banner_picture' => 'nullable|image|max:4096',
    ]);

    Log::info("Datos validados", $data);

    // Manejo de archivos
    if ($request->hasFile('profile_picture')) {
        Log::info("Nueva imagen de perfil recibida", ['file' => $request->file('profile_picture')->getClientOriginalName()]);

        if ($user->profile_picture) {
            @unlink(public_path('images/users/' . $user->profile_picture));
        }

        $file = $request->file('profile_picture');
        $filename = time().'_profile_'.$file->getClientOriginalName();
        $file->move(public_path('images/users'), $filename);
        $data['profile_picture'] = $filename;
        Log::info("Nueva imagen de perfil guardada", ['new' => $filename]);
    }

    if ($request->hasFile('banner_picture')) {
        Log::info("Nuevo banner recibido", ['file' => $request->file('banner_picture')->getClientOriginalName()]);

        if ($user->banner_picture) {
            @unlink(public_path('images/users/' . $user->banner_picture));
            Log::info("Banner anterior eliminado", ['old' => $user->banner_picture]);
        }

        $file = $request->file('banner_picture');
        $filename = time().'_banner_'.$file->getClientOriginalName();
        $file->move(public_path('images/users'), $filename);
        $data['banner_picture'] = $filename;
        Log::info("Nuevo banner guardado", ['new' => $filename]);
    }

    Log::info("Antes de actualizar", $user->toArray());

    $user->fill($data);
    $user->save();
    $user->refresh();

    Log::info("Después de actualizar", $user->toArray());

    return response()->json([
        'message' => 'Perfil actualizado correctamente',
        'user' => new UserResource($user),
    ]);
}

    //Funcion Logout
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json([
                    'message' => 'La sesión ha sido cerrada exitosamente.']);
    }
}
