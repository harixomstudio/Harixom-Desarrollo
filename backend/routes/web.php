<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Requests\AuthAdminRequest;
use App\Http\Middleware\AdminMiddleware;


Route::get('/', [AdminController::class, 'login'])->name('admin.login');
Route::post('/admin/auth', [AdminController::class, 'auth'])->name('admin.auth');

Route::middleware(AdminMiddleware::class)->group(function(){
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.index');
    Route::post('/admin/logout', [AdminController::class, 'logout'])->name('admin.logout');
    Route::post('/admin/users/{id}/enable', [AdminController::class, 'enable'])->name('admin.users.enable');
    Route::post('/admin/users/{id}/disable', [AdminController::class, 'disable'])->name('admin.users.disable');
    Route::get('/admin/users/create', [AdminController::class, 'create'])->name('createUser');
    Route::post('/admin/users', [App\Http\Controllers\Api\UserController::class, 'store'])->name('storeUser');
});


Route::get('/event', function () {return view('Events.indexEvent');})->name('event');
Route::get('/createEvent', function () {return view('Events.createEvent');})->name('createEvent');
Route::get('/updateEvent', function () {return view('Events.updateEvent');})->name('updateEvent');

Route::get('/taller', function () {return view('Talleres.indexTaller');})->name('taller');
Route::get('/createTaller', function () {return view('Talleres.createTaller');})->name('createTaller');
Route::get('/updateTaller', function () {return view('Talleres.updateTaller');})->name('updateTaller');
