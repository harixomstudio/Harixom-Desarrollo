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
use App\Services\BrevoMailer;
use Illuminate\Http\Request;

class InteractionController extends Controller
{
    //Funcion para dar like
    public function toggleLike($publicationId, Request $request)
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
                'user_id' => $user->id,
                'for_user_id' => $publication->user_id,
                'title' => $request->title,
                'status' => $request->status
            ]);
            $liked = true;
        }

        $publication->likes_count = $publication->likes()->count();
        $publication->save();

        return response()->json([
            'liked' => $liked,
            'for_user_id' => $publication->user_id,
            'title' => $request->title,
            'status' => $request->status,
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

    public function userLikesNotis($userId)
    {
        $likes = Like::with('publication')
        ->where('for_user_id', $userId)
        ->orderBy('created_at', 'asc')
        ->get();

        return response()->json([
            'likes' => $likes->map(function ($like) {
                return [
                    'publication_id' => $like->publication->id,
                    'for_user_id' => $like->for_user_id,
                    'title' => $like->title,
                    'user_id' => $like->user_id,
                    'user' => ['name' => $like->user ? $like->user->name : 'Anonimo'],
                    'description' => $like->publication->description,
                    'status' => $like->status,
                    'created_at' => $like->created_at->diffForHumans(),
                ];
            })
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
                'created_at' => $follow->created_at->diffForHumans()
            ];
        });

        // Obtener los usuarios que lo siguen (followers)
        $followers = $user->followers()->with('follower')->get()->map(function ($follow) {
            return [
                'id' => $follow->follower->id,
                'title' => $follow->title,
                'name' => $follow->follower->name,
                'status' => $follow->status,
                'created_at' => $follow->created_at->diffForHumans()
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
            ->get()
            ->map(function ($commission) {
                return [
                    'id' => $commission->id,
                    'from_user' => [
                        'id' => $commission->fromUser->id,
                        'name' => $commission->fromUser->name,
                    ],
                    'to_user_id' => $commission->to_user_id,
                    'message' => $commission->message,
                    'status' => $commission->status,
                    'created_at' => $commission->created_at->diffForHumans(),
                ];
            });

        return response()->json(['commissions' => $commissions]);
    }


    public function welcome(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

         $user = User::where('email', $request->email)->first();

          if (!$user) {
            return response()->json([
                'error' => 'No se encontró un usuario con ese correo.'
            ], 409);
        }

        try{
            $htmlContent = "
        <div style=' background-color: #0c0a09;  padding: 30px; font-family: Arial, Helvetica, sans-serif; color: white; border-radius: 10px;'>
        <div style=' max-width: 600px; margin: auto;  background-color: #202020; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); padding: 30px;'>
            <div style='text-align: center;'>
                <h2 style='color: #f6339a;'>¡Hola {$user->name}, Bienvenido a Harixom!</h2>
                <h4>Disfruta de nuestros servicios</h4>
            </div>

            <p style='font-size: 16px; line-height: 1.6;'>
                ¡Gracias por unirte a Harixom! Estamos emocionados de tenerte con nosotros.
                Esperemos que disfrutes de todos los beneficios que ofrecemos y que encuentres lo que 
                necesitas para tus proyectos
                y tareas, no dudes en contactarnos si tienes alguna pregunta.
            </p>

            <p style='font-size: 15px; color: #ffff;'>
                Gracias por elegirnos.
            </p>

            <hr style='border: none; border-top: 1px solid #ddd; margin: 30px 0;'>

            <p style='text-align: center; color: #999; font-size: 13px;'>
                &copy; " . date('Y') . " Harixom. Todos los derechos reservados.
            </p>
        </div>
    </div>
    ";

            BrevoMailer::send(
                $request->email,
                "Bienvenido a Harixom - Disfrute de nuestros servicios.",
                $htmlContent
            );
        } catch (\Exception $e) {
            Log::error('Error al enviar correo en Notification: ' . $e->getMessage());
        }


        return response()->json([
            'message' => 'Has recibido un correo de bienvenida.',
        ], 200);
    }
}
