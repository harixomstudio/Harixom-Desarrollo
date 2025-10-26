<?php

namespace App\Providers;

use Illuminate\Support\Facades\Mail;
use App\Mail\Transport\BrevoTransport;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Mail\MailManager;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.frontend_url') . "/ResetPassword?token=$token&email=" . urlencode($user->email);
        });
    }
}
