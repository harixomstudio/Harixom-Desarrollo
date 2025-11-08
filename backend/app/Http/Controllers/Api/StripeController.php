<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use App\Models\Subscription;
use App\Services\BrevoMailer;
use Illuminate\Support\Facades\Log;

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


    public function sendSuccessEmail(Request $request)
    {
        $user = $request->user();
        $plan = $request->input('plan');

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        try {
            $htmlContent = "
        <div style='background-color:#0c0a09; padding:30px; color:white; border-radius:10px; font-family:Arial, Helvetica, sans-serif;'>
            <div style='max-width:600px; margin:auto; background-color:#202020; border-radius:10px; padding:30px;'>
                <h2 style='color:#f6339a;'>¡Hi, the subscription has been completed {$user->name}!</h2>
                <p>Your subscription <b>{$plan}</b> plan has been successfully completed. Your account is now <b>premium</b> and your plan renewal date is <b>" . now()->addDays($plan === 'monthly' ? 30 : 365) . "</b>. </p>
                <p>You can now access all the features of Harixom.</p>
                <p>¡Thanks for your purchase! Best regards, Harixom team.</p>
                <hr style='border:none; border-top:1px solid #ddd; margin:30px 0;'>
                <p style='text-align:center; color:#999; font-size:13px;'>&copy; " . date('Y') . " Harixom - All rights reserved.</p>
            </div>
        </div>";

            BrevoMailer::send($user->email, "Subscription Completed - Harixom", $htmlContent);

            return response()->json(['message' => 'Your subscription has been completed successfully']);
        } catch (\Exception $e) {
            Log::error("Error enviando correo de éxito: " . $e->getMessage());
            return response()->json(['error' => 'No se pudo enviar el correo.'], 500);
        }
    }


    public function sendCancelEmail(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Usuario no autenticado'], 401);
        }

        try {
            $htmlContent = "
        <div style='background-color:#0c0a09; padding:30px; color:white; border-radius:10px; font-family:Arial, Helvetica, sans-serif;'>
            <div style='max-width:600px; margin:auto; background-color:#202020; border-radius:10px; padding:30px;'>
                <h2 style='color:#f6339a;'>Hi {$user->name}, your subscription has been cancelled</h2>
                <p>We regret to inform you that your subscription has been cancelled.</p>
                <p>You can always renew your subscription at any time. Come back soon!</p>
                <hr style='border:none; border-top:1px solid #ddd; margin:30px 0;'>
                <p style='text-align:center; color:#999; font-size:13px;'>&copy; " . date('Y') . " Harixom - All rights reserved.</p>
            </div>
        </div>";

            BrevoMailer::send($user->email, "Subscription Cancelled - Harixom", $htmlContent);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error("Error send cancel email: " . $e->getMessage());
            return response()->json(['error' => 'Cannot send email'], 500);
        }
    }
}
