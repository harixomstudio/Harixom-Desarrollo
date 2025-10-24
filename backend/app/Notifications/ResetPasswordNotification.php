<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use App\Services\BrevoMailer;

class ResetPasswordNotification extends Notification
{
    public $token;
    public $email;

    public function __construct($token, $email)
    {
        $this->token = $token;
        $this->email = $email;
    }

    // No necesitamos 'via' porque no vamos a usar el sistema de mail de Laravel
    public function sendResetEmail()
    {
        $url = url("https://harixom.netlify.app/resetPassword?token={$this->token}&email={$this->email}");

        $subject = 'Restablecer contraseña';
        $html = view('emails.reset-password-html', ['url' => $url])->render();

        return BrevoMailer::send($this->email, $subject, $html);
    }
}
