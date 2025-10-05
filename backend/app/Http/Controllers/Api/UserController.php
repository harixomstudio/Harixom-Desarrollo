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
use App\Models\Like;
use App\Models\Follow;

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
        $upload = new UploadApi();
        $user = $request->user();

        $data = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^\+\d{1,3}\d{4,14}$/'],
            'address' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
            'profile_picture' => 'nullable|image|max:3072',
            'banner_picture' => 'nullable|image|max:4096',
            'services' => 'nullable|string',
            'prices' => 'nullable|string',
            'terms' => 'nullable|string',
        ]);


        // Manejo de archivos
        if ($request->hasFile('profile_picture')) {
           
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
            }

        if ($request->hasFile('banner_picture')) {
            
            if ($user->banner_picture) {
                @unlink(public_path($user->banner_picture));
                }

         
            $result = $upload->upload($request->file('banner_picture')->getRealPath(), [
            'folder' => 'Users/Banners',
            'use_filename' => true,
            'unique_filename' => true,
            'overwrite' => true,
        ]);

        $data['banner_picture'] = $result['secure_url'];
        }

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


    //Funciones para perfil ajeno
    public function showGuest($id)
{
    $user = User::with(['posts' => function($query){
        $query->orderBy('created_at', 'desc');
    }])->findOrFail($id);

    $authUser = auth()->user();
    $isFollowing = false;

    if ($authUser) {
        $isFollowing = $authUser->follows()->where('following_id', $id)->exists();
    }

    $followers = Follow::with('follower')
    ->where('following_id', $id)
    ->get()
    ->map(fn($f) => [
        'id' => $f->follower->id,
        'name' => $f->follower->name,
        'profile_picture' => $f->follower->profile_picture
    ]);

$followings = Follow::with('following')
    ->where('follower_id', $id)
    ->get()
    ->map(fn($f) => [
        'id' => $f->following->id,
        'name' => $f->following->name,
        'profile_picture' => $f->following->profile_picture
    ]);

    return response()->json([
        'user' => $user,
        'isFollowing' => $isFollowing,
        'followers' => $followers,
        'followings' => $followings,
    ]);
}

    // Likes del usuario
    public function guestLikes($id)
    {
        $likes = Like::with('publication')
            ->where('user_id', $id)
            ->get()
            ->map(function($like){
                return $like->publication;
            });

        return response()->json([
            'likes' => $likes
        ]);
    }

    // Followers y followings
    public function guestFollows($id)
    {
        $followers = Follow::with('follower')
            ->where('following_id', $id)
            ->get()
            ->map(fn($f) => $f->follower);

        $followings = Follow::with('following')
            ->where('follower_id', $id)
            ->get()
            ->map(fn($f) => $f->following);

        return response()->json([
            'followers' => $followers,
            'followings' => $followings,
        ]);
    }

    
}
