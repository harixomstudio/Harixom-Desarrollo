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