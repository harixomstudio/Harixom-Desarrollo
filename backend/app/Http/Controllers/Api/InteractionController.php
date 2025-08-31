<?php

// app/Http/Controllers/Api/InteractionController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Follow;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InteractionController extends Controller
{
    public function toggleLike($id)
    {
        try {
            $publication = Publication::findOrFail($id);
            $user = Auth::user();

            // Alterna like/unlike
            if ($publication->likes()->where('user_id', $user->id)->exists()) {
                $publication->likes()->where('user_id', $user->id)->delete();
                $liked = false;
            } else {
                $publication->likes()->create(['user_id' => $user->id]);
                $liked = true;
            }

            return response()->json(['liked' => $liked]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function toggleFollow($userId)
    {
        $followerId = Auth::id();
        $follow = Follow::where('follower_id', $followerId)->where('following_id', $userId)->first();

        if ($follow) {
            $follow->delete();
            return response()->json(['following' => false]);
        }

        Follow::create(['follower_id' => $followerId, 'following_id' => $userId]);
        return response()->json(['following' => true]);
    }

    public function addComment(Request $request, $publicationId)
    {
        $request->validate(['comment' => 'required|string|max:500']);
        $comment = Comment::create([
            'user_id' => Auth::id(),
            'publication_id' => $publicationId,
            'comment' => $request->comment
        ]);

        return response()->json([
            'comment' => $comment->load('user')
        ]);
    }
}

