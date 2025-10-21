<?php

namespace App\Http\Controllers\Api; 

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session as CheckoutSession;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $plan = $request->plan; // 'monthly' o 'annual'

        $priceId = $plan === 'monthly' 
            ? env('STRIPE_PRICE_MONTHLY') 
            : env('STRIPE_PRICE_ANNUAL');

        $session = CheckoutSession::create([
            'customer_email' => Auth::user()->email,
            'line_items' => [
                [
                    'price' => $priceId,
                    'quantity' => 1,
                ],
            ],
            'mode' => 'subscription',
            'success_url' => env('APP_URL') . '/subscriptions/success?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => env('APP_URL') . '/subscriptions/canceled',
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function handleWebhook(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');

        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);

            switch ($event->type) {
                case 'customer.subscription.created':
                case 'customer.subscription.updated':
                    $subscription = $event->data->object;
                    Subscription::updateOrCreate(
                        ['stripe_subscription_id' => $subscription->id],
                        [
                            'user_id' => Auth::id(), // puedes mapear con email si quieres
                            'stripe_customer_id' => $subscription->customer,
                            'plan' => $subscription->items->data[0]->price->nickname ?? 'unknown',
                            'status' => $subscription->status,
                        ]
                    );
                    break;

                case 'customer.subscription.deleted':
                    $subscription = $event->data->object;
                    $sub = Subscription::where('stripe_subscription_id', $subscription->id)->first();
                    if ($sub) {
                        $sub->status = 'canceled';
                        $sub->save();
                    }
                    break;
            }

            return response()->json(['status' => 'success']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
