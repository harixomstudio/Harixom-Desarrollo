<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Subscription;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {

        // Loguear todo lo que entra
    \Log::info('Headers recibidos:', $request->headers->all());

    // Intentar obtener el usuario autenticado
    $user = $request->user();

    // Log para ver si el usuario es null
    if (!$user) {
        \Log::warning('Usuario no autenticado', ['headers' => $request->headers->all()]);
        return response()->json(['error' => 'Usuario no autenticado'], 401);
    }

// Loguear el usuario recibido
    \Log::info('Usuario autenticado', [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email
    ]);

$email = $user->email; // viene del token
        $plan = $request->plan;   // 'monthly' o 'annual'
        \Log::info('Plan seleccionado', ['plan' => $plan]);

        Stripe::setApiKey('sk_test_51SKQLwRtEJ6FFuUtTad4B2Sn6kI4DxGpIhuRj5kspE1rurj45nrqqm2THLHI1CP3MAd1ZXBAKVZkgG3HhuGLgol600EST2fRbm');

        $priceId = $plan === 'monthly'
            ? 'price_1SKQXRRtEJ6FFuUtsSOpb7df' 
            : 'price_1SKQYmRtEJ6FFuUtK9JWK24a';

        $session = Session::create([
            'customer_email' => $user->email,
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => env('FRONTEND_URL') . '/Profile',
            'cancel_url' => env('FRONTEND_URL') . '/subscription-cancelled',
        ]);

        \Log::info('Stripe session creada', ['url' => $session->url]);

        return response()->json(['url' => $session->url]);
    }

    public function handleWebhook(Request $request)
{
    $payload = $request->getContent();
    $sigHeader = $request->header('Stripe-Signature');
    $secret = env('STRIPE_WEBHOOK_SECRET');

    try {
        $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $secret);
        \Log::info('✅ Webhook recibido', ['type' => $event->type]);
    } catch (\Exception $e) {
        \Log::error('⚠️ Error webhook', ['msg' => $e->getMessage()]);
        return response('Webhook error', 400);
    }

    // ✅ Solo aquí procesas el evento
    switch ($event->type) {
        case 'checkout.session.completed':
            $session = $event->data->object;
            $user = \App\Models\User::where('email', $session->customer_email)->first();
            if ($user) {
                $user->is_premium = true;
                $user->save();
                \Log::info('Usuario actualizado a premium', ['user_id' => $user->id]);
            }
            break;

        case 'customer.subscription.deleted':
            $sub = \App\Models\Subscription::where('stripe_subscription_id', $event->data->object->id)->first();
            if ($sub) {
                $sub->update(['status' => 'canceled']);
                $sub->user->update(['is_premium' => false]);
            }
            break;
    }

    return response('Webhook handled', 200); // Siempre responde 200 si todo va bien
}
}
