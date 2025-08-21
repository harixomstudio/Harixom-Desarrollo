<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Resources\UserResource;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('user', function (Request $request) {
        return [
            'user' => UserResource::make($request->user()),
            'access_token' => $request->bearerToken(),
        ];
    });
    Route::post('user/logout', [UserController::class, 'logout']);
});

//Rutas para publicaciones

//Rutas para comentarios

//Rutas para likes

//Rutas para seguidores

//Rutas para mensajes

//Rutas para notificaciones

//Rutas de los Usuarios
Route::post('user/register', [UserController::class, 'store']);
Route::post('user/login', [UserController::class, 'auth']);
