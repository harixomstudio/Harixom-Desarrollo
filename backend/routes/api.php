<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Api\PublicationController;
use App\Http\Controllers\Api\InteractionController;
use App\Http\Controllers\Api\AIController;
use App\Http\Controllers\Api\EventApiController;
use App\Http\Controllers\Api\NotisController;
use App\Http\Controllers\Api\TallerApiController;
use App\Http\Controllers\Api\ProfileMessageController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\StripeController;
use App\Http\Middleware\UserMiddleware;
use App\Http\Controllers\Auth\EmailReportController;



Route::middleware(['auth:sanctum', UserMiddleware::class])->group(function () {
    //Rutas de perfil
    // Obtener perfil del usuario logueado
    Route::get('/user', [UserController::class, 'profile']);
    // Actualizar perfil
    Route::put('/user/profile', [UserController::class, 'updateProfile']);
    //Cerrar sesion
    Route::post('user/logout', [UserController::class, 'logout']);

    //Bloquear y desbloquear usuarios
    Route::post('/block/{userId}', [UserController::class, 'blockUser']);
    Route::delete('/unblock/{userId}', [UserController::class, 'unblockUser']);

    //Ruta para buscar
    Route::get('/search', [SearchController::class, 'search']);

    //Rutas para publicaciones
    Route::post('/publications', [PublicationController::class, 'store']);
    Route::get('/publications', [PublicationController::class, 'index']);
    Route::get('/publications/{id}', [PublicationController::class, 'show']);
    Route::delete('/publications/{id}', [PublicationController::class, 'destroy']);

    // Rutas para likes
    Route::post('/like/{publication}', [InteractionController::class, 'toggleLike']);
    Route::get('/user/likes', [InteractionController::class, 'userLikes']);
    Route::get('/user/likes/{userId}', [InteractionController::class, 'userLikesNotis']);

    // Rutas para seguidores
    Route::get('user/follows', [InteractionController::class, 'userFollows']);
    Route::post('/follow/{user}', [InteractionController::class, 'toggleFollow']);
    Route::post('/follow/{userId}', [InteractionController::class, 'toggleFollow']);

    // Rutas para comentarios
    Route::post('/comment/{publication}', [InteractionController::class, 'addComment']);
    Route::get('/comment/{publication}', [InteractionController::class, 'getComments']);
    Route::get('/user/comments/{userId}', [InteractionController::class, 'userComments']);

    //Rutas para mensajes del perfil
    Route::get('/profile/{userId}/messages', [ProfileMessageController::class, 'index']);
    Route::post('/profile/messages', [ProfileMessageController::class, 'store']);
    Route::delete('/profile/messages/{profileMessage}', [ProfileMessageController::class, 'destroy']);

    //Rutas para notificaciones
    Route::post('/user/commisions', [InteractionController::class, 'commisions']);
    Route::get('/user/commisions/{userId}', [InteractionController::class, 'index']);

    //ruta para el link de coffee
    Route::middleware('auth:sanctum')->post('user/update-coffee-link', [UserController::class, 'linkCoffee']);

    //Rutas para visualizar otros perfiles ajenos
    Route::middleware('auth:sanctum')->get('/users/{id}', [UserController::class, 'showGuest']);
    Route::get('/users/{id}/likes', [UserController::class, 'guestLikes']);
    Route::get('/users/{id}/follows', [UserController::class, 'guestFollows']);
    Route::get('/follow/{user}/check', [InteractionController::class, 'checkFollow']);

    //Pagos
    Route::post('/create-checkout-session', [StripeController::class, 'createCheckoutSession']);
    Route::post('/cancelSubscription', [StripeController::class, 'cancelSubscription']);
    //Mostrar informacion de pagos
    Route::get('/subscriptions', [StripeController::class, 'userSubscriptions']);

    // Subgrupo solo para usuarios premium
    Route::post('/events/create', [EventApiController::class, 'store']);
    Route::post('/workshops/create', [TallerApiController::class, 'store']);

    //Rutas de envio de emails de stripe para suscripciones
    Route::post('/subscription-success-email', [StripeController::class, 'sendSuccessEmail']);
    Route::post('/subscription-cancel-email', [StripeController::class, 'sendCancelEmail']);

    //Ruta obtener todas las notificaciones
    Route::get('/notifications/{userId}', [NotisController::class, 'notis']);

});

//Stripe
Route::post('/stripe/webhook', [StripeController::class, 'handleWebhook']);

//emailReport
Route::post('/email/report', [EmailReportController::class, 'sendReport']);

//Rutas para eventos y talleres
Route::get('/events', [EventApiController::class, 'index']);
Route::get('/events/{id}', [EventApiController::class, 'show']);
Route::get('/tallers', [TallerApiController::class, 'index']);
Route::get('/tallers/{id}', [TallerApiController::class, 'show']);

// Rutas de IA sin auth
Route::post('ia/challenge', [AIController::class, 'getChallenge']);

//Rutas de reset password
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::post('/change-password', [PasswordResetController::class, 'changePassword']);
Route::post('/password-getChange', [PasswordResetController::class, 'change']);

//Ruta de bienvenida a Harixom
Route::post('/welcome', [InteractionController::class, 'welcome']);


//Rutas de los Usuarios antes de autenticarse
Route::post('user/register', [UserController::class, 'store']);
Route::post('user/login', [UserController::class, 'auth']);
