<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
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
    $query = strtolower(ltrim(trim($request->input('q')), '@'));
    $authUser = Auth::user();

    if (!$query) {
        return response()->json(['message' => 'Debe proporcionar un término de búsqueda.'], 400);
    }

    // Usuarios filtrando bloqueos
    $users = User::whereRaw('LOWER(name) LIKE ?', ["%{$query}%"])
        ->whereDoesntHave('blockedByUsers', function ($q) use ($authUser) {
            $q->where('user_id', $authUser->id);
        })
        ->whereDoesntHave('blockedUsers', function ($q) use ($authUser) {
            $q->where('blocked_user_id', $authUser->id);
        })
        ->select('id', 'name', 'profile_picture', 'is_premium')
        ->limit(10)
        ->get();

    // Publicaciones filtrando bloqueos
    $publications = Publication::where('description', 'LIKE', "%{$query}%")
        ->orWhere('category', 'LIKE', "%{$query}%")
        ->whereDoesntHave('user', function ($q) use ($authUser) {
            $q->whereHas('blockedUsers', function ($q2) use ($authUser) {
                $q2->where('blocked_user_id', $authUser->id);
            })
            ->orWhereHas('blockedByUsers', function ($q2) use ($authUser) {
                $q2->where('user_id', $authUser->id);
            });
        })
        ->select('id', 'description', 'image', 'user_id')
        ->limit(10)
        ->get();

    return response()->json([
        'users' => $users,
        'publications' => $publications
    ]);
}
}
