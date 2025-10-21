<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session as CheckoutSession;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $user = $request->user();
        $plan = $request->input('plan'); // 'monthly' | 'annual'

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $priceId = $plan === 'annual'
            ? env('STRIPE_ANNUAL_PRICE')
            : env('STRIPE_MONTHLY_PRICE');

        try {
            $session = CheckoutSession::create([
                'mode' => 'subscription',
                'payment_method_types' => ['card'],
                'line_items' => [[
                    'price' => $priceId,
                    'quantity' => 1,
                ]],
                'metadata' => [
                    'user_id' => $user->id,
                    'plan' => $plan
                ],
                'success_url' => env('FRONTEND_URL') . '/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => env('FRONTEND_URL') . '/cancel',
                'customer_email' => $user->email,
            ]);

            return response()->json(['url' => $session->url]);
        } catch (\Exception $e) {
            Log::error('Stripe Error: ' . $e->getMessage());
            return response()->json(['error' => 'Error creando la sesión de pago'], 500);
        }
    }

    public function webhook(Request $request)
    {
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');
        $payload = $request->getContent();
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\UnexpectedValueException $e) {
            return response('Invalid payload', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $userId = $session->metadata->user_id ?? null;
            $plan = $session->metadata->plan ?? 'monthly';

            if ($userId) {
                $user = User::find($userId);
                if ($user) {
                    $duration = $plan === 'annual' ? 365 : 30;
                    $user->is_premium = true;
                    $user->premium_expires_at = Carbon::now()->addDays($duration);
                    $user->payment_provider = 'stripe';
                    $user->payment_subscription_id = $session->subscription ?? null;
                    $user->save();

                    Log::info("Usuario {$user->name} ahora es premium ({$plan})");
                }
            }
        }

        return response()->json(['received' => true]);
    }
}
