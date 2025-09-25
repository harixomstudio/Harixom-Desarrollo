<?php

// app/Http/Controllers/Admin/TallerController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Taller;

class TallerController extends Controller
{
    public function index()
    {
        $tallers = Taller::all();
        return view('Talleres.indexTaller', compact('tallers'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'mode' => 'required|string',
            'dateStart' => 'required|date',
            'timeStart' => 'required',
            'duration' => 'nullable|string',
            'title' => 'required|string',
            'place' => 'required|string',
            'description' => 'required|string',
            'contributor' => 'nullable|string',
        ]);
        Taller::create($data);
        return redirect()->route('taller')->with('success','Taller creado');
    }

    public function edit($id)
{
    $taller = Taller::findOrFail($id);
    return view('Talleres.updateTaller', compact('taller'));
}

    public function update(Request $request, $id)
    {
        $taller = Taller::findOrFail($id);
        $data = $request->validate([
            'mode' => 'required|string',
            'dateStart' => 'required|date',
            'timeStart' => 'required',
            'duration' => 'nullable|string',
            'title' => 'required|string',
            'place' => 'required|string',
            'description' => 'required|string',
            'contributor' => 'nullable|string',
        ]);
        $taller->update($data);
        return redirect()->route('taller')->with('success','Taller actualizado');
    }

    public function destroy(Request $request)
    {
        $taller = Taller::findOrFail($request->taller_id);
        $taller->delete();
        return redirect()->route('taller')->with('success','Taller eliminado');
    }
}

