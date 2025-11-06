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
    // Intentar obtener el usuario autenticado
    $user = $request->user();

    // Log para ver si el usuario es null
    if (!$user) {
        return response()->json(['error' => 'Usuario no autenticado'], 401);
    }

        $email = $user->email; // viene del token
        $plan = $request->plan;   // 'monthly' o 'annual'
        Stripe::setApiKey(env('STRIPE_SECRET'));

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
            'success_url' => env('FRONTEND_URL') . '/subscription-success?plan=' . $plan,
            'cancel_url' => env('FRONTEND_URL') . '/subscription-cancelled',
        ]);

        Subscription::create([
        'user_id' => $user->id,
        'stripe_price_id' => $priceId,
        'plan' => $plan,
        'amount' => $plan === 'monthly' ? 8.00 : 76.08,
        'currency' => 'usd',
        'start_date' => now(),
        'status' => 'pending', // hasta que se confirme el pago
    ]);

        $user->is_premium = true;
    $user->save();
    \Log::info('Usuario marcado como premium (simulación)', ['user_id' => $user->id]);

        return response()->json(['url' => $session->url]);
    }

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

public function userSubscriptions(Request $request)
{
    $user = $request->user();

    if (!$user) {
        return response()->json(['error' => 'Usuario no autenticado'], 401);
    }

    $subscriptions = Subscription::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json(['subscriptions' => $subscriptions]);
}
}
