<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class PremiumOnly
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->user() || !auth()->user()->is_premium) {
            return response()->json(['error' => 'Acceso solo para usuarios premium'], 403);
        }

        return $next($request);
    }
}
