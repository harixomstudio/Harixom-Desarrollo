<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Like;
use App\Models\Follow;
use App\Models\Comment;
use App\Models\Publication;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    //Funcion para dar like
    public function toggleLike($publicationId)
{
    $user = auth()->user();
    if (!$user) {
        Log::warning('Usuario no autenticado intentando dar like');
        return response()->json(['error' => 'No autenticado'], 401);
    }

    $publication = Publication::findOrFail($publicationId);

    $existingLike = $publication->likes()->where('user_id', $user->id)->first();

    if ($existingLike) {
        $existingLike->delete();
        $liked = false;
    } else {
        $publication->likes()->create([
            'user_id' => $user->id
        ]);
        $liked = true;
    }

    $publication->likes_count = $publication->likes()->count();
    $publication->save();

    return response()->json([
        'liked' => $liked,
        'total_likes' => $publication->likes_count
    ]);
}

//Funcion para mostrar los likes
public function userLikes()
{
    $user = auth()->user();
    $likes = $user->likes()->with('publication')->get();

    return response()->json([
        'likes' => $likes->map(fn($like) => [
            'id' => $like->publication->id,
            'description' => $like->publication->description,
            'image' => $like->publication->image,
        ])
    ]);
}

    //Funcion para seguir
    public function toggleFollow($userId)
{
    $user = auth()->user();
    if (!$user) {
        Log::info('Usuario autenticado: ' . $user->id);
    Log::info('Intentando seguir a usuario: ' . $userId);
        Log::warning("Usuario no autenticado intentando seguir");
        return response()->json(['error' => 'No autenticado'], 401);
    }

    // Verificamos que no se siga a sí mismo
    if ($user->id == $userId) {
        return response()->json(['error' => 'No puedes seguirte a ti mismo'], 400);
    }

    $target = User::findOrFail($userId);

    // Revisamos si ya sigue
    $existingFollow = $user->follows()->where('following_id', $target->id)->first();

    if ($existingFollow) {
        // Deja de seguir
        $existingFollow->delete();
        $following = false;
    } else {
        // Empieza a seguir
        $user->follows()->create([
            'following_id' => $target->id
        ]);
        $following = true;
    }

    return response()->json([
        'following' => $following
    ]);
}


    //Funcion para dejar un comentario
    public function addComment(Request $request, $publicationId)
    {
        $request->validate(['comment' => 'required|string|max:500']);

        // Guardar comentario sin usuario
        $comment = Comment::create([
            'user_id' => null,
            'publication_id' => $publicationId,
            'comment' => $request->comment
        ]);

        return response()->json([
            'comment' => [
                'user' => ['name' => 'Anonimo'],
                'comment' => $comment->comment
            ]
        ]);
    }
}


