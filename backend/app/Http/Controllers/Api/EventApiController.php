<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

Configuration::instance('cloudinary://175261732836894:2Cofi1fGKc6rmC1-ELQKZjxKCuw@duxccowqf?secure=true');

class EventApiController extends Controller
{
    /**
     * Listar todos los eventos
     */
    public function index()
    {
        $events = Event::orderBy('dateStart', 'asc')->get();

        return response()->json([
            'events' => $events,
            'message' => 'Lista de eventos obtenida correctamente.'
        ], 200);
    }

    /**
     * Mostrar un evento por ID
     */
    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Evento no encontrado.'
            ], 404);
        }

        return response()->json([
            'event' => $event
        ], 200);
    }

    /**
     * Crear un nuevo evento
     */
    public function store(Request $request)
    {
        $upload = new UploadApi();

        $data = $request->validate([
            'type' => 'required|string|max:255',
            'dateStart' => 'required|date',
            'timeStart' => 'required|string',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'dateEnd' => 'required|date|after_or_equal:dateStart',
            'timeEnd' => 'required|string',
            'image' => 'nullable|image|max:3072',
        ]);

        // Subida a Cloudinary
        if ($request->hasFile('image')) {
            $result = $upload->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'Events/Main',
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true,
                ]
            );

            $data['image'] = $result['secure_url'];
        }

        $event = Event::create($data);

        return response()->json([
            'message' => 'Evento creado correctamente.',
            'event' => $event
        ], 201);
    }

    /**
     * Actualizar un evento existente
     */
    public function update(Request $request, $id)
    {
        $upload = new UploadApi();
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Evento no encontrado.'
            ], 404);
        }

        $data = $request->validate([
            'type' => 'sometimes|required|string|max:255',
            'dateStart' => 'sometimes|required|date',
            'timeStart' => 'sometimes|required|string',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'dateEnd' => 'sometimes|required|date|after_or_equal:dateStart',
            'timeEnd' => 'sometimes|required|string',
            'image' => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('image')) {
            $result = $upload->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'Events/Main',
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true,
                ]
            );

            $data['image'] = $result['secure_url'];
        }

        $event->update($data);

        return response()->json([
            'message' => 'Evento actualizado correctamente.',
            'event' => $event
        ], 200);
    }

    /**
     * Eliminar un evento
     */
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Evento no encontrado.'
            ], 404);
        }

        $event->delete();

        return response()->json([
            'message' => 'Evento eliminado correctamente.'
        ], 200);
    }
}
