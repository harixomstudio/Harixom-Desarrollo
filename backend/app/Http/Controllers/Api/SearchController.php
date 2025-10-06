<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Publication;

class SearchController extends Controller
{
    /**
     * Busca usuarios y publicaciones según el texto ingresado.
     */
    public function search(Request $request)
{
    $query = trim($request->input('q'));

    if (!$query) {
        return response()->json(['message' => 'Debe proporcionar un término de búsqueda.'], 400);
    }

    // Si es solo una letra, busca solo al inicio; si es más, puede buscar en cualquier lugar
    $pattern = strlen($query) === 1 ? "{$query}%" : "{$query}%";

    // Usuarios
    $users = User::where('name', 'LIKE', $pattern)
        ->select('id', 'name', 'profile_picture')
        ->limit(10)
        ->get();

    // Publicaciones (solo por nombre o categoría que empiece con el texto)
    $publications = Publication::where('description', 'LIKE', $pattern)
        ->orWhere('category', 'LIKE', $pattern)
        ->select('id', 'description', 'image', 'user_id')
        ->limit(10)
        ->get();

    return response()->json([
        'users' => $users,
        'publications' => $publications
    ]);
}
}
