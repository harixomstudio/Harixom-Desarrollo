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
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

Configuration::instance('cloudinary://175261732836894:2Cofi1fGKc6rmC1-ELQKZjxKCuw@duxccowqf?secure=true');


class UserController extends Controller
{
    //Funcion store
    public function store(StoreUserRequest $request)
    {
        $upload = new UploadApi();
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);

        
        // Guardar imagen de perfil
        if ($request->hasFile('profile_picture')) {
            $result = $upload->upload(
                $request->file('profile_picture')->getRealPath(),
                [
                    'folder' => 'Profile', // carpeta en tu cuenta de Cloudinary
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true
                ]
                
            );
            dd($upload);
            dd($data);
            $data['profile_picture'] = $result['secure_url']; 
        }

        // Guardar banner
        if ($request->hasFile('banner_picture')) {
            $result = $upload->upload(
                $request->file('banner_picture')->getRealPath(),
                [
                    'folder' => 'Banners', // carpeta en tu cuenta de Cloudinary
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true
                ]
            );

            $data['banner_picture'] = $result['secure_url']; 
        }


        $user = User::create($data);

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
        $upload = new UploadApi();
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
                @unlink(public_path($user->profile_picture));
            }

            $result = $upload->upload($request->file('profile_picture')->getRealPath(), [
                'folder' => 'Users/Profile',
                'use_filename' => true,
                'unique_filename' => true,
                'overwrite' => true,
            ]);

            $data['profile_picture'] = $result['secure_url'];
            Log::info("Nueva imagen de perfil guardada", ['new' => $result['secure_url']]);
        }

        if ($request->hasFile('banner_picture')) {
            Log::info("Nuevo banner recibido", ['file' => $request->file('banner_picture')->getClientOriginalName()]);

            if ($user->banner_picture) {
                @unlink(public_path($user->banner_picture));
                Log::info("Banner anterior eliminado", ['old' => $user->banner_picture]);
            }

         
            $result = $upload->upload($request->file('banner_picture')->getRealPath(), [
            'folder' => 'Users/Banners',
            'use_filename' => true,
            'unique_filename' => true,
            'overwrite' => true,
        ]);

        $data['banner_picture'] = $result['secure_url'];
        }

        Log::info("Antes de actualizar", $user->toArray());

        $user->fill($data);
        $user->save();
        $user->refresh();


        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => new UserResource($user),
        ]);
    }

    //Funcion Logout
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'La sesión ha sido cerrada exitosamente.'
        ]);
    }
}
