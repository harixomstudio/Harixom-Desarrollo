<?php

namespace App\Http\Middleware;

use Closure;

class SanitizeInput
{
    public function handle($request, Closure $next)
    {
        $input = $request->all();

        array_walk_recursive($input, function (&$input) {
            $input = strip_tags($input); // elimina etiquetas HTML
        });

        $request->merge($input);

        return $next($request);
    }
}
