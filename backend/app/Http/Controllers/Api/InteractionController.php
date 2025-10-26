<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Like;
use App\Models\Follow;
use App\Models\Comment;
use App\Models\Commission;
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
    public function toggleFollow(Request $request, $userId)
    {
        $user = auth()->user();
        if (!$user) {
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
                'title' => $request->title,
                'following_id' => $target->id,
                'status' => $request->status
            ]);
            $following = true;
        }

        return response()->json([
            'title' => $request->title,
            'following' => $following,
            'status' => $request->status
        ]);
    }

    public function checkFollow($userId)
    {
        $user = auth()->user();
        $exists = $user->follows()->where('following_id', $userId)->exists();

        return response()->json([

            'following' => $exists
        ]);
    }

    public function userFollows()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Obtener los usuarios que sigue
        $followings = $user->follows()->with('following')->get()->map(function ($follow) {
            return [
                'id' => $follow->following->id,
                'title' => $follow->title,
                'name' => $follow->following->name,
                'status' => $follow->status,
                'created_at' => $follow->created_at
            ];
        });

        // Obtener los usuarios que lo siguen (followers)
        $followers = $user->followers()->with('follower')->get()->map(function ($follow) {
            return [
                'id' => $follow->follower->id,
                'title' => $follow->title,
                'name' => $follow->follower->name,
                'status' => $follow->status,
                'created_at' => $follow->created_at
            ];
        });

        return response()->json([
            'followings' => $followings,
            'followers' => $followers
        ]);
    }

    //Funcion para dejar un comentario
    public function addComment(Request $request, $publicationId)
    {
        $user = auth()->user(); // Usuario logueado

        $request->validate([
            'title' => 'required|string|max:100',
            'comment' => 'required|string|max:500',
            'for_user_id' => 'required|exists:users,id',
            'status' => 'required|in:Low,Medium,High',
        ]);



        $comment = Comment::create([
            'title' => $request->title,
            'user_id' => $user->id,
            'for_user_id' => $request->for_user_id,
            'publication_id' => $publicationId,
            'comment' => $request->comment,
            'status' => $request->status
        ]);

        return response()->json([
            'comment' => [
                'title' => $comment->title,
                'for_user_id' => $comment->for_user_id,
                'user' => ['name' => $user ? $user->name : 'Anonimo'],
                'comment' => $comment->comment,
                'status' => $comment->status
            ]
        ]);
    }

    public function getComments($publicationId)
    {
        $comments = Comment::with('user') // para traer info del usuario
            ->where('publication_id', $publicationId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'comments' => $comments->map(function ($comment) {
                return [
                    'title' => $comment->title,
                    'id' => $comment->id,
                    'for_user_id' => $comment->for_user_id,
                    'user' => ['id' => $comment->user->id, 'name' => $comment->user->name],
                    'comment' => $comment->comment,
                    'status' => $comment->status,
                    'created_at' => $comment->created_at->diffForHumans(),
                ];
            })
        ]);
    }

    public function userComments($userId)
    {
        $comments = Comment::with('user')
            ->where('for_user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'comments' => $comments->map(function ($comment) {
                return [
                    'title' => $comment->title,
                    'id' => $comment->id,
                    'for_user_id' => $comment->for_user_id,
                    'user' => ['id' => $comment->user->id, 'name' => $comment->user->name],
                    'comment' => $comment->comment,
                    'status' => $comment->status,
                    'created_at' => $comment->created_at->diffForHumans(),
                ];
            })
        ]);
    }


    public function commisions(Request $request)
    {
        $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:500',
            'date' => 'required|date',
        ]);

        $commission = Commission::create([
            'from_user_id' => auth()->id(),
            'to_user_id' => $request->to_user_id,
            'message' => $request->message,
            'status' => 'High',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $commission->id,
                'from_user' => $commission->fromUser->only(['id', 'name', 'profile_picture']),
                'to_user' => $commission->toUser->only(['id', 'name']),
                'message' => $commission->message,
                'created_at' => $commission->created_at->diffForHumans(),
            ],
        ]);
    }

    public function index($userId)
    {
        $commissions = Commission::with('fromUser')
            ->where('to_user_id', $userId)
            ->latest()
            ->get();

        return response()->json(['commissions' => $commissions]);
    }
}
