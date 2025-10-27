<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use App\Models\Follow;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;

Configuration::instance('cloudinary://175261732836894:2Cofi1fGKc6rmC1-ELQKZjxKCuw@duxccowqf?secure=true');

class PublicationController extends Controller
{

    public function index()
{
    // Verifica si hay usuario autenticado
    $authUser = Auth::check() ? Auth::user() : null;

    // Aplica el filtro de bloqueados solo si hay usuario autenticado
    $query = Publication::query();

    if ($authUser) {
        $query->withoutBlocked($authUser);
    }

    $publications = $query
        ->with(['user:is_premium', 'likes'])
        ->withCount(['likes', 'comments'])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($pub) {
            return [
                'id' => $pub->id,
                'description' => $pub->description,
                'category' => $pub->category,
                'image' => $pub->image,
                'created_at' => $pub->created_at,
                'user_id' => $pub->user ? $pub->user->id : null,
                'user_name' => $pub->user ? $pub->user->name : 'Usuario',
                'is_premium' => (bool) ($pub->user?->is_premium ?? false),
                'user_profile_picture' => $pub->user
                    ? $pub->user->profilePicturePath()
                    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                'total_likes' => $pub->likes_count,
                'total_comments' => $pub->comments_count,
            ];
        });

    return response()->json([
        'publications' => $publications,
    ]);
}

    public function store(Request $request)
    {
        $upload = new UploadApi();

        $request->validate([
            'description' => 'nullable|string|max:1000',
            'category' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:3072',
        ], [
    'image.max' => 'La imagen no puede superar los 3 MB.',
    'image.mimes' => 'El archivo debe ser una imagen (jpg, jpeg, png, gif).'

        ]);

        $imageUrl = null;

        if ($request->hasFile('image')) {
    $file = $request->file('image');

    ////////////////////////////////////////////////////
    \Log::info("Archivo recibido: " . $file->getClientOriginalName());
    \Log::info("Tipo MIME: " . $file->getMimeType());
    \Log::info("Tamaño: " . $file->getSize());
    ////////////////////////////////////////////

    try {
        $result = $upload->upload(
            $file->getRealPath(),
            [
                'folder' => 'Harixom/Publications',
                'use_filename' => true,
                'unique_filename' => true,
                'overwrite' => true
            ]
        );
        $imageUrl = $result['secure_url'];

        ////////////////////////////////////////////////////////
        \Log::info("Imagen subida correctamente a Cloudinary: " . $imageUrl);
        //////////////////////////////////////////

    } catch (\Exception $e) {
        ///////////////////////////////////////////////////////////
        \Log::error("Error al subir a Cloudinary: " . $e->getMessage());
        /////////////////////////////////////
        return response()->json([
            'error' => 'No se pudo subir la imagen',
            'details' => $e->getMessage()
        ], 500);
    }
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

    public function show($id)
{
    $pub = Publication::with('user', 'likes', 'comments')->find($id);

    if (!$pub) {
        return response()->json(['error' => 'Publicación no encontrada'], 404);
    }

    return response()->json([
        'id' => $pub->id,
        'description' => $pub->description,
        'category' => $pub->category,
        'image' => $pub->image,
        'created_at' => $pub->created_at,
        'user_id' => $pub->user ? $pub->user->id : null,
        'user_name' => $pub->user ? $pub->user->name : 'Usuario',
        'user_profile_picture' => $pub->user ? $pub->user->profilePicturePath() : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        'total_likes' => $pub->likes->count(),
        'total_comments' => $pub->comments->count(),
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
            $filePath = public_path(basename($publication->image));
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        $publication->delete();

        return response()->json(['message' => 'Publicación eliminada correctamente']);
    }
}
