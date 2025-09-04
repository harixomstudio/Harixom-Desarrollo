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
            
            $file->move(public_path('images/publications'), $filename);
            
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

    //Funcion destroy
    public function destroy($id)
{
    $publication = Publication::find($id);

    if (!$publication) {
        return response()->json(['error' => 'Publicación no encontrada'], 404);
    }

    // Validar propietario
    if ($publication->user_id !== Auth::id()) {
        return response()->json(['error' => 'No autorizado'], 403);
    }

    // Eliminar imagen si existe
    if ($publication->image) {
        $filePath = public_path('images/publications/' . basename($publication->image));
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    $publication->delete();

    return response()->json(['message' => 'Publicación eliminada correctamente']);
}
}
