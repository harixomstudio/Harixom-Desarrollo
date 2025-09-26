<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Resources\UserResource;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\InteractionController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\EventApiController;
use App\Http\Controllers\Api\TallerApiController;

Route::middleware('auth:sanctum')->group(function(){
    // Obtener perfil del usuario logueado
    Route::get('/user', [UserController::class, 'profile']);

    // Actualizar perfil
    Route::put('/user/profile', [UserController::class, 'updateProfile']);

    //Cerrar sesion
    Route::post('user/logout', [UserController::class, 'logout']);

    //Rutas para publicaciones
    Route::post('/publications', [PublicationController::class, 'store']);
    Route::get('/publications', [PublicationController::class, 'index']);
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy']);

    // Rutas para likes
    Route::post('/like/{publication}', [InteractionController::class, 'toggleLike']);
    Route::get('/user/likes', [InteractionController::class, 'userLikes']);

    // Rutas para seguidores
    Route::get('user/follows', [InteractionController::class, 'userFollows']);
    Route::post('/follow/{user}', [InteractionController::class, 'toggleFollow']);
    Route::post('/follow/{userId}', [InteractionController::class, 'toggleFollow']);

    // Rutas para comentarios
    Route::post('/comment/{publication}', [InteractionController::class, 'addComment']);
    Route::get('/comment/{publication}', [InteractionController::class, 'getComments']);

    
//Rutas para mensajes

//Rutas para notificaciones



});

Route::middleware('auth:sanctum')->get('/users/{id}', [UserController::class, 'showGuest']);
Route::get('/users/{id}/likes', [UserController::class, 'guestLikes']);
Route::get('/users/{id}/follows', [UserController::class, 'guestFollows']);
Route::get('/follow/{user}/check', [InteractionController::class, 'checkFollow']);

//Rutas para eventos y talleres
    Route::get('/events', [EventApiController::class, 'index']);
    Route::get('/tallers', [TallerApiController::class, 'index']);


// Rutas de IA sin auth
Route::post('ia/challenge', [AIController::class, 'getChallenge']);

//Rutas de reset password
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

//Rutas de los Usuarios
Route::post('user/register', [UserController::class, 'store']);
Route::post('user/login', [UserController::class, 'auth']);
