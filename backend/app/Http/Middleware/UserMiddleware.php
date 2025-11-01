<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Verificar si el usuario está autenticado con el guard por defecto (user)
        if (auth()->check()) {
            return $next($request);
        }

        // Si no está autenticado, redirigir a login de usuario
        return redirect()->route('user.login');
    }
}
