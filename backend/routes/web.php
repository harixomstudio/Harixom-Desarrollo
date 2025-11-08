<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Requests\AuthAdminRequest;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\TallerController;


Route::get('/', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/auth', [AdminController::class, 'auth'])->name('admin.auth');

Route::middleware(AdminMiddleware::class)->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
    Route::post('/admin/users/{id}/enable', [AdminController::class, 'enable'])->name('admin.users.enable');
    Route::post('/admin/users/{id}/disable', [AdminController::class, 'disable'])->name('admin.users.disable');
    Route::get('/admin/users/create', [AdminController::class, 'create'])->name('createUser');
    Route::post('/admin/users', [App\Http\Controllers\Api\UserController::class, 'store'])->name('storeUser');

    // Mostrar index de eventos
    Route::get('/event', [EventController::class, 'index'])->name('event');

    // Crear evento
    Route::get('/createEvent', function () {
        return view('Events.createEvent');
    })->name('createEvent');
    Route::post('/createEvent', [EventController::class, 'store'])->name('storeEvent');

    // Editar evento
    Route::get('/updateEvent/{id}', [EventController::class, 'edit'])->name('updateEvent');
    Route::post('/updateEvent/{id}', [EventController::class, 'update'])->name('updateEventAction');

    // Eliminar evento
    Route::post('/deleteEvent', [EventController::class, 'destroy'])->name('deleteEvent');

    Route::get('/taller', [TallerController::class, 'index'])->name('taller');

    Route::get('/createTaller', function () {
        return view('Talleres.createTaller');
    })->name('createTaller');
    Route::post('/createTaller', [TallerController::class, 'store'])->name('storeTaller');

    Route::get('/updateTaller/{id}', [TallerController::class, 'edit'])->name('updateTaller');
    Route::put('/updateTaller/{id}', [TallerController::class, 'update'])->name('updateTallerAction');

    Route::post('/deleteTaller', [TallerController::class, 'destroy'])->name('deleteTaller');
});
