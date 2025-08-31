<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Api\PublicationController;


Route::middleware('auth:sanctum')->group(function(){
    Route::get('user', function (Request $request) {
        return [
            'user' => UserResource::make($request->user()),
            'access_token' => $request->bearerToken(),
        ];
    });
    // Obtener perfil del usuario logueado
    Route::get('/user', [UserController::class, 'profile']);

    // Actualizar perfil
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    //Cerrar sesion
    Route::post('user/logout', [UserController::class, 'logout']);

    //Rutas para publicaciones
    Route::post('/publications', [PublicationController::class, 'store']);
    Route::get('/publications', [PublicationController::class, 'index']);

//Rutas para comentarios
Route::post('/comment/{publication}', [InteractionController::class, 'addComment']);

//Rutas para likes
Route::post('/like/{publication}', [InteractionController::class, 'toggleLike']);

//Rutas para seguidores
Route::post('/follow/{user}', [InteractionController::class, 'toggleFollow']);

//Rutas para mensajes

//Rutas para notificaciones


});

//Rutas de reset password
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

//Rutas de los Usuarios
Route::post('user/register', [UserController::class, 'store']);
Route::post('user/login', [UserController::class, 'auth']);
