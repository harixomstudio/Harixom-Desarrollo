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
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        $plan = $request->plan; // 'monthly' o 'annual'
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $priceId = $plan === 'monthly'
            ? 'price_1SKQXRRtEJ6FFuUtsSOpb7df' 
            : 'price_1SKQYmRtEJ6FFuUtK9JWK24a';

        // Crear la sesión de Stripe
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

        // Guardar la suscripción como activa
        Subscription::create([
            'user_id' => $user->id,
            'stripe_subscription_id' => null,
            'stripe_customer_id' => null,
            'plan_type' => $plan,
            'amount' => $plan === 'monthly' ? 8.00 : 76.08,
            'currency' => 'usd',
            'start_date' => now(),
            'end_date' => now()->addDays($plan === 'monthly' ? 30 : 365),
            'status' => 'active', // simulamos el pago completado
        ]);

        // Actualizar al usuario como premium
        $user->is_premium = true;
        $user->save();

        return response()->json(['url' => $session->url]);
    }

    public function cancelSubscription(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->is_premium) {
            return response()->json(['error' => 'No hay suscripción activa'], 400);
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Crear un nuevo registro de suscripción cancelada (para historial)
            Subscription::create([
                'user_id' => $user->id,
                'stripe_subscription_id' => null,
                'stripe_customer_id' => null,
                'plan_type' => 'cancelled',
                'amount' => 0,
                'currency' => 'usd',
                'start_date' => now(),
                'end_date' => now(),
                'status' => 'canceled',
            ]);

            // Actualizar usuario
            $user->is_premium = false;
            $user->save();

            return response()->json(['message' => 'Suscripción cancelada y registrada correctamente']);
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