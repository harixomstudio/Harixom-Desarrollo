<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Event;

class EventController extends Controller
{
    // Mostrar todos los eventos
    public function index()
    {
        $events = Event::all(); 
        return view('Events.indexEvent', compact('events'));
    }

    // Guardar un nuevo evento
    public function store(Request $request)
    {
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
            $imagePath = $request->file('image')->store('events', 'public'); 
            $data['image'] = $imagePath;
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
            // Borrar la imagen anterior si existe
            if ($event->image) {
                Storage::disk('public')->delete($event->image);
            }
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event->update($data);

        return redirect()->route('event')->with('success', 'Event updated successfully!');
    }

    // Eliminar un evento
    public function destroy(Request $request)
    {
        $event = Event::findOrFail($request->event_id);

        // Borrar imagen asociada
        if ($event->image) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return redirect()->route('event')->with('success', 'Event deleted successfully!');
    }
}
