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
$query = ltrim($query, '@'); 
$query = strtolower($query);

if (!$query) {
    return response()->json(['message' => 'Debe proporcionar un término de búsqueda.'], 400);
}

// Buscar usuarios ignorando mayúsculas/minúsculas
$users = User::whereRaw('LOWER(name) LIKE ?', ["%{$query}%"])
    ->select('id', 'name', 'profile_picture')
    ->limit(10)
    ->get();

// Publicaciones
$publications = Publication::where('description', 'LIKE', "%{$query}%")
    ->orWhere('category', 'LIKE', "%{$query}%")
    ->select('id', 'description', 'image', 'user_id')
    ->limit(10)
    ->get();

return response()->json([
    'users' => $users,
    'publications' => $publications
]);
}
}
