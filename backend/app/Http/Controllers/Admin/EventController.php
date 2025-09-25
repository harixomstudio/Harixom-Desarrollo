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
        $events = Event::all(); // o tu lógica
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
        ]);

        Event::create([
    'type' => $data['type'],
    'title' => $data['title'],
    'description' => $data['description'],
    'dateStart' => $data['dateStart'],
    'timeStart' => $data['timeStart'],
    'dateEnd' => $data['dateEnd'],
    'timeEnd' => $data['timeEnd'],
]);

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
        ]);

        $event->update([
            'type' => $data['type'],
            'dateStart' => $data['dateStart'],
            'timeStart' => $data['timeStart'],
            'title' => $data['title'],
            'description' => $data['description'],
            'dateEnd' => $data['dateEnd'],
            'timeEnd' => $data['timeEnd'],
        ]);

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
