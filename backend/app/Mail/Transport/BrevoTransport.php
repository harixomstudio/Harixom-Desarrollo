<?php

namespace App\Mail\Transport;

use Symfony\Component\Mailer\Transport\TransportInterface;
use Symfony\Component\Mime\Email;
use GuzzleHttp\Client;

class BrevoTransport implements TransportInterface
{
    protected $client;

    public function __construct(array $config)
    {
        $this->client = new Client([
            'base_uri' => 'https://api.brevo.com/v3/smtp/email',
            'headers' => [
                'api-key' => $config['password'] ?? env('MAIL_PASSWORD'),
                'Content-Type' => 'application/json',
            ],
        ]);
    }

    public function send(Email $email, &$failedRecipients = null): void
    {
        $to = array_map(fn($a) => $a->getAddress(), $email->getTo());
        $body = [
            'sender' => [
                'name' => $email->getFrom()[0]->getName(),
                'email' => $email->getFrom()[0]->getAddress()
            ],
            'to' => array_map(fn($t) => ['email' => $t], $to),
            'subject' => $email->getSubject(),
            'htmlContent' => $email->getHtmlBody() ?: $email->getTextBody(),
        ];

        $this->client->post('', ['json' => $body]);
    }

    public function __toString(): string
    {
        return 'brevo';
    }
}
