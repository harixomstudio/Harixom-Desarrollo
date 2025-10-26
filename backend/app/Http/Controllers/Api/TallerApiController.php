<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Taller;
use Cloudinary\Configuration\Configuration;
use Cloudinary\Api\Upload\UploadApi;
use Illuminate\Http\Response;

Configuration::instance('cloudinary://175261732836894:2Cofi1fGKc6rmC1-ELQKZjxKCuw@duxccowqf?secure=true');

class TallerApiController extends Controller
{
    /**
     * 🔹 Listar todos los talleres
     */
    public function index()
    {
        $talleres = Taller::orderBy('created_at', 'desc')->get();

        return response()->json([
            'talleres' => $talleres,
            'message' => 'Lista de talleres obtenida correctamente.',
        ], 200);
    }

    /**
     * 🔹 Mostrar un taller específico
     */
    public function show($id)
    {
        $taller = Taller::find($id);

        if (!$taller) {
            return response()->json(['error' => 'Taller no encontrado.'], 404);
        }

        return response()->json([
            'taller' => $taller,
        ], 200);
    }

    /**
     * 🔹 Crear un nuevo taller (solo usuarios premium autenticados)
     */
    public function store(Request $request)
    {
        try {
            $user = $request->user(); // obtiene el usuario autenticado por Sanctum

            if (!$user) {
                return response()->json(['error' => 'No autorizado.'], 401);
            }

            if (!$user->is_premium) {
                return response()->json(['error' => 'Solo usuarios premium pueden crear talleres.'], 403);
            }

            $data = $request->validate([
                'mode' => 'required|string',
                'dateStart' => 'required|date',
                'timeStart' => 'required',
                'duration' => 'nullable|string|max:50',
                'title' => 'required|string|max:255',
                'place' => 'required|string|max:255',
                'description' => 'required|string',
                'contributor' => 'nullable|string|max:255',
                'image' => 'nullable|image|max:3072',
            ]);

            $upload = new UploadApi();

            // Subir imagen si se envía
            if ($request->hasFile('image')) {
                $result = $upload->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder' => 'Events/talleres',
                        'use_filename' => true,
                        'unique_filename' => true,
                        'overwrite' => true,
                    ]
                );

                $data['image'] = $result['secure_url'];
            }

            $data['user_id'] = $user->id;

            $taller = Taller::create($data);

            return response()->json([
                'message' => 'Taller creado correctamente.',
                'taller' => $taller,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error al crear taller: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al crear el taller.'], 500);
        }
    }

    /**
     * 🔹 Actualizar taller existente
     */
    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'No autorizado.'], 401);
            }

            $taller = Taller::findOrFail($id);

            if ($taller->user_id !== $user->id) {
                return response()->json(['error' => 'No puedes editar este taller.'], 403);
            }

            $data = $request->validate([
                'mode' => 'nullable|string',
                'dateStart' => 'nullable|date',
                'timeStart' => 'nullable|string',
                'duration' => 'nullable|string|max:50',
                'title' => 'nullable|string|max:255',
                'place' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'contributor' => 'nullable|string|max:255',
                'image' => 'nullable|image|max:3072',
            ]);

            if ($request->hasFile('image')) {
                $upload = new UploadApi();

                $result = $upload->upload(
                    $request->file('image')->getRealPath(),
                    [
                        'folder' => 'Events/talleres',
                        'use_filename' => true,
                        'unique_filename' => true,
                        'overwrite' => true,
                    ]
                );

                $data['image'] = $result['secure_url'];
            }

            $taller->update($data);

            return response()->json([
                'message' => 'Taller actualizado correctamente.',
                'taller' => $taller,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al actualizar taller: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al actualizar el taller.'], 500);
        }
    }

    /**
     * 🔹 Eliminar taller
     */
    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $taller = Taller::findOrFail($id);

            if ($taller->user_id !== $user->id) {
                return response()->json(['error' => 'No puedes eliminar este taller.'], 403);
            }

            $taller->delete();

            return response()->json(['message' => 'Taller eliminado correctamente.'], 200);
        } catch (\Exception $e) {
            Log::error('Error al eliminar taller: ' . $e->getMessage());
            return response()->json(['error' => 'Error interno al eliminar el taller.'], 500);
        }
    }
}
