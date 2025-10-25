<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

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
}
