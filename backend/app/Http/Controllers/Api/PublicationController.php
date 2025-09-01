<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{

    public function index()
{
    $publications = Publication::with('user')
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($pub) {
            return [
                'id' => $pub->id,
                'description' => $pub->description,
                'category' => $pub->category,
                'image' => $pub->image,
                'created_at' => $pub->created_at,
                'user_name' => $pub->user ? $pub->user->name : 'Usuario',
                'user_profile_picture' => $pub->user ? $pub->user->profilePicturePath() : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
            ];
        });

    return response()->json([
        'publications' => $publications
    ]);
}

    public function store(Request $request)
    {
        $request->validate([
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_publication_' . $file->getClientOriginalName();
            
            // Mueve la imagen a public/images/publications
            $file->move(public_path('images/publications'), $filename);
            
            // Crea la URL completa que se puede usar en el frontend
            $imageUrl = url('images/publications/' . $filename);
        }

        $publication = Publication::create([
            'user_id' => Auth::id(),
            'image' => $imageUrl, // guarda la URL completa
            'description' => $request->description,
            'category' => $request->category,
            'uploaded_at' => now(),
        ]);

        return response()->json([
            'message' => 'Publicación creada correctamente',
            'publication' => $publication
        ]);
    }
}
