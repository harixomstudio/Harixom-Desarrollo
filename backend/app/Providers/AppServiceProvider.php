<?php

namespace App\Providers;

use Illuminate\Support\Facades\Mail;
use App\Mail\Transport\BrevoTransport;
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
        /** Registrar el transport personalizado 'brevo' */
       Mail::extend('brevo', function ($config) {
        return new BrevoTransport($config);
    });
    }
}
