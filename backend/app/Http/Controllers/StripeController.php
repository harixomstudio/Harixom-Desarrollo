<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Subscription;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $user = $request->user(); // viene del token
        $plan = $request->plan;   // 'monthly' o 'annual'

        Stripe::setApiKey(config('services.stripe.secret'));

        $priceId = $plan === 'monthly'
            ? 'price_1QABC123xyz456Monthly'  // ← reemplaza con tu ID de Stripe real
            : 'price_1QABC123xyz456Annual';  // ← reemplaza con tu ID de Stripe real

        $session = Session::create([
            'customer_email' => $user->email,
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => env('FRONTEND_URL') . '/subscription-success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('FRONTEND_URL') . '/subscription-cancelled',
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function handleWebhook(Request $request)
    {
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
}
