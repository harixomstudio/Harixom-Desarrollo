<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use Illuminate\Auth\Notifications\ResetPassword;

use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
{
    ResetPassword::createUrlUsing(function ($user, string $token) {
        return config('app.frontend_url') . "/ResetPassword?token=$token&email=" . urlencode($user->email);
    });
}
}
