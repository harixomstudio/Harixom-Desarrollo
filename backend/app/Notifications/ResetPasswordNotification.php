<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = env('FRONTEND_URL') . '/ResetPassword?token=' . $this->token . '&email=' . urlencode($notifiable->email);


        return (new MailMessage)
            ->subject('Restablecer contraseña')
            ->line('Has solicitado restablecer tu contraseña.')
            ->action('Restablecer contraseña', $url)
            ->line('Si no solicitaste este cambio, ignora este correo.');
    }
}
