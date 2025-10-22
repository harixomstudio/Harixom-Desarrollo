<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
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

        Stripe::setApiKey(config('services.stripe.secret'));

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
            'success_url' => env('FRONTEND_URL') . '/subscription-success',
            'cancel_url' => env('FRONTEND_URL') . '/subscription-cancelled',
        ]);

        \Log::info('Stripe session creada', ['url' => $session->url]);

        $user->is_premium = true;
        $user->save();
        \Log::info('Usuario marcado como premium (simulación)', ['user_id' => $user->id]);

        return response()->json(['url' => $session->url]);
    }

<<<<<<< Updated upstream
    public function handleWebhook(Request $request)
    {
        \Log::info('Webhook recibido', ['payload' => $request->getContent()]);
        $payload = $request->getContent();
        $sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        }

        // 🔹 Cuando se crea la suscripción
        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;

            $user = \App\Models\User::where('email', $session->customer_email)->first();
            if ($user) {
                Subscription::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'stripe_subscription_id' => $session->subscription,
                        'stripe_customer_id' => $session->customer,
                        'plan_type' => 'monthly', // o determinarlo dinámicamente
                        'status' => 'active'
                    ]
                );

                $user->update(['is_premium' => true]);
            }
        }

        // 🔸 Si la suscripción se cancela
        if ($event->type === 'customer.subscription.deleted') {
            $sub = Subscription::where('stripe_subscription_id', $event->data->object->id)->first();
            if ($sub) {
                $sub->update(['status' => 'canceled']);
                $sub->user->update(['is_premium' => false]);
            }
        }

        return response('Webhook handled', 200);
    }
=======
    public function cancelSubscription(Request $request)
{
    $user = $request->user();

    // Verificar si el usuario está marcado como premium
    if (!$user || !$user->is_premium) {
        return response()->json(['error' => 'No hay suscripción activa'], 400);
    }

    Stripe::setApiKey(env('STRIPE_SECRET'));

    try {
        // Si el usuario no tiene un stripe_subscription_id, solo baja su estado premium
        if (!$user->stripe_subscription_id) {
            $user->is_premium = false;
            $user->save();

            return response()->json([
                'message' => 'Suscripción cancelada localmente (sin registro en Stripe)'
            ]);
        }

        // Si tiene un ID válido en Stripe, se cancela allá también
        $subscription = \Stripe\Subscription::retrieve($user->stripe_subscription_id);
        $subscription->cancel(); // Cancela inmediatamente

        // Actualiza el usuario
        $user->is_premium = false;
        $user->stripe_subscription_id = null;
        $user->save();

        return response()->json(['message' => 'Suscripción cancelada con éxito']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
>>>>>>> Stashed changes
}
