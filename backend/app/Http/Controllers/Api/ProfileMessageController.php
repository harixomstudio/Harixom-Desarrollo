<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProfileMessage;
use Illuminate\Http\Request;

class ProfileMessageController extends Controller
{
    // Obtener mensajes de un perfil
    public function index($userId)
    {
        $messages = ProfileMessage::with('fromUser:id,name,profile_picture')
            ->where('to_user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'messages' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'from_user' => [
                        'id' => $message->fromUser->id,
                        'name' => $message->fromUser->name,
                    ],
                    'to_user_id' => $message->to_user_id,
                    'title' => $message->title,
                    'message' => $message->message,
                    'status' => $message->status,
                    'created_at' => $message->created_at->diffForHumans(),
                ];
            })
        ]);
    }

    // Crear nuevo mensaje en un perfil
    public function store(Request $request)
    {
        $request->validate([
            'to_user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:100',
            'message' => 'required|string|max:1000',
            'status' => 'required|in:Low,Medium,High',
        ]);

        $message = ProfileMessage::create([
            'from_user_id' => $request->user()->id,
            'to_user_id' => $request->to_user_id,
            'title' => $request->title,
            'message' => $request->message,
            'status' => $request->status,

        ]);

        return response()->json([
            'message' => 'Mensaje publicado con éxito',
            'data' => $message->load('fromUser:id,name,profile_picture'),
        ], 201);
    }

    // Eliminar mensaje (solo el dueño del perfil o el autor)
    public function destroy(ProfileMessage $profileMessage, Request $request)
    {
        if (
            $profileMessage->from_user_id !== $request->user()->id &&
            $profileMessage->to_user_id !== $request->user()->id
        ) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $profileMessage->delete();

        return response()->json(['message' => 'Mensaje eliminado']);
    }
}
