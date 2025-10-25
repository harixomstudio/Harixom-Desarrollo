<?php

namespace App\Notifications;

use App\Services\BrevoMailer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

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
        return ['brevo'];
    }

    public function toBrevo($notifiable)
    {
        $resetUrl = env('FRONTEND_URL') . "/ResetPassword?token={$this->token}&email={$notifiable->email}";

        try {
            BrevoMailer::send($notifiable->email, "Restablecer contraseña", "
            <h2>Hola {$notifiable->name}</h2>
            <h4>Este es un correo de restablecimiento de contraseña de Harixom </h4>
            <p>Haz clic aquí para restablecer tu contraseña:</p>
            <a href='{$resetUrl}'>Restablecer contraseña</a>
            <p>Si no has solicitado un restablecimiento de contraseña, puedes ignorar este correo.</p>
            <p>Atentamente, el equipo de Harixom</p>

        ");
        } catch (\Exception $e) {
            Log::error('Error al enviar correo en Notification: ' . $e->getMessage());
        }
    }
}
