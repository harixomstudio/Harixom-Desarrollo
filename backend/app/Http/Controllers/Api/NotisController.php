<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Comment;
use App\Models\Commission;
use App\Models\ProfileMessage;

class NotisController extends Controller
{
    public function notis($userId)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        // Comisiones recibidas
        $commissions = Commission::with('fromUser')
            ->where('to_user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'from_user' => [
                    'id' => $c->fromUser->id ?? null,
                    'name' => $c->fromUser->name ?? 'Desconocido',
                ],
                'to_user_id' => $c->to_user_id,
                'message' => $c->message,
                'howDoIt' => $c->howDoIt,
                'details' => $c->details,
                'dateDoIt' => $c->dateDoIt,
                'status' => $c->status,
                'created_at' => $c->created_at->diffForHumans(),
            ]);

        // Mensajes en el muro
        $messages = ProfileMessage::with('fromUser:id,name,profile_picture')
            ->where('to_user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'from_user' => [
                    'id' => $m->fromUser->id ?? null,
                    'name' => $m->fromUser->name ?? 'Desconocido',
                    'profile_picture' => $m->fromUser->profile_picture ?? null,
                ],
                'to_user_id' => $m->to_user_id,
                'title' => $m->title,
                'message' => $m->message,
                'status' => $m->status,
                'created_at' => $m->created_at->diffForHumans(),
            ]);

        // Comentarios en publicaciones
        $comments = Comment::with('user')
            ->where('for_user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($cm) => [
                'id' => $cm->id,
                'title' => $cm->title,
                'for_user_id' => $cm->for_user_id,
                'user' => [
                    'id' => $cm->user->id ?? null,
                    'name' => $cm->user->name ?? 'Anónimo',
                ],
                'comment' => $cm->comment,
                'status' => $cm->status,
                'created_at' => $cm->created_at->diffForHumans(),
            ]);

        // Seguidores y seguidos
        $followers = $user->followers()->with('follower')->get()->map(fn($f) => [
            'id' => $f->follower->id,
            'name' => $f->follower->name,
            'title' => $f->title,
            'status' => $f->status,
            'created_at' => $f->created_at->diffForHumans(),
        ]);


        // Likes recibidos
        $likes = Like::with(['publication', 'user'])
            ->where('for_user_id', $userId)
            ->latest()
            ->get()
            ->map(fn($l) => [
                'publication_id' => $l->publication->id ?? null,
                'for_user_id' => $l->for_user_id,
                'title' => $l->title,
                'user_id' => $l->user_id,
                'user' => [
                    'name' => $l->user->name ?? 'Anónimo',
                ],
                'description' => $l->publication->description ?? '',
                'status' => $l->status,
                'created_at' => $l->created_at->diffForHumans(),
            ]);

        // Retornar TODO en una sola respuesta
        return response()->json([
            'data' => [
                'commissions' => $commissions,
                'messages' => $messages,
                'comments' => $comments,
                'followers' => $followers,
                'likes' => $likes,
            ]
        ]);
    }
}
