<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

Configuration::instance('cloudinary://175261732836894:2Cofi1fGKc6rmC1-ELQKZjxKCuw@duxccowqf?secure=true');

class EventApiController extends Controller
{
    public function index()
    {
        return response()->json(Event::all());
    }

    public function show($id)
{
    $event = Event::find($id);

    if (!$event) {
        return response()->json(['message' => 'Evento no encontrado'], 404);
    }

    return response()->json($event, 200);
}

public function store(Request $request)
    {
        $upload = new UploadApi();

        $data = $request->validate([
            'type' => 'required|string',
            'dateStart' => 'required|date',
            'timeStart' => 'required',
            'title' => 'required|string',
            'description' => 'required|string',
            'dateEnd' => 'required|date',
            'timeEnd' => 'required',
            'image' => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('image')) {
            $result = $upload->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'Events/events',
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true
                ]
            );
            $data['image'] = $result['secure_url']; //guarda la URL de Cloudinary
        }

        Event::create($data);

        return redirect()->route('event')->with('success', 'Event created successfully!');
    }

    public function edit($id)
    {
        $event = Event::findOrFail($id); // Si no existe, lanza 404
        return view('Events.updateEvent', compact('event'));
    }

    // Actualizar un evento
    public function update(Request $request, $id)
    {
        $upload = new UploadApi();
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'type' => 'required|string',
            'dateStart' => 'required|date',
            'timeStart' => 'required',
            'title' => 'required|string',
            'description' => 'required|string',
            'dateEnd' => 'required|date',
            'timeEnd' => 'required',
            'image' => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('image')) {
            // Subir la nueva imagen a Cloudinary
            $result = $upload->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'Events/events',
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true
                ]
            );

            $data['image'] = $result['secure_url']; // ✅ URL de Cloudinary
        }

        $event->update($data);

        return redirect()->route('event')->with('success', 'Event updated successfully!');
    }

    // Eliminar un evento
    public function destroy(Request $request)
    {
        $event = Event::findOrFail($request->event_id);

        $event->delete();

        return redirect()->route('event')->with('success', 'Event deleted successfully!');
    }
}
