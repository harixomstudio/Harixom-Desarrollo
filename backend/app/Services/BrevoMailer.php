<?php

namespace App\Services;

use Brevo\Client\Api\TransactionalEmailsApi;
use SendinBlue\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use SendinBlue\Client\Api\TransactionalEmailsApi as ApiTransactionalEmailsApi;
use SendinBlue\Client\Model\SendSmtpEmail as ModelSendSmtpEmail;

class BrevoMailer
{
    public static function send($to, $subject, $html)
    {
        try {
            $config = Configuration::getDefaultConfiguration()
                ->setApiKey('api-key', env('BREVO_API_KEY'));

            $apiInstance = new ApiTransactionalEmailsApi(new Client(), $config);

            $email = new ModelSendSmtpEmail([
                'sender' => [
                    'email' => env('MAIL_FROM_ADDRESS', 'no-reply@harixom.com'),
                    'name'  => env('MAIL_FROM_NAME', 'Harixom'),
                ],
                'to' => [
                    ['email' => $to],
                ],
                'subject' => $subject,
                'htmlContent' => $html,
            ]);

            return $apiInstance->sendTransacEmail($email);

        } catch (\Exception $e) {
            Log::error('Error al enviar correo con Brevo: ' . $e->getMessage());
            return false;
        }
    }
}
