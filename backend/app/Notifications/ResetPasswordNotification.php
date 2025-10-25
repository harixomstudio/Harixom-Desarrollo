<?php

namespace App\Notifications;

use App\Services\BrevoMailer;
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

        $subject = 'Restablecer contraseña';
        $html = "
            <p>Hola, {$notifiable->name}</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p><a href='{$url}'>Haz clic aquí para cambiar tu contraseña</a></p>
            <p>Si no solicitaste este cambio, ignora este correo.</p>
        ";

        return BrevoMailer::send($notifiable->email, $subject, $html);
        
    }
}
