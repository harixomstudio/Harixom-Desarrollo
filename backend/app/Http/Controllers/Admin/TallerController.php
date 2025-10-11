<?php

// app/Http/Controllers/Admin/TallerController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Taller;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

Configuration::instance('cloudinary://175261732836894:2Cofi1fGKc6rmC1-ELQKZjxKCuw@duxccowqf?secure=true');

class TallerController extends Controller
{
    public function index()
    {
        $tallers = Taller::all();
        return view('Talleres.indexTaller', compact('tallers'));
    }

    public function store(Request $request)
    {

        $upload = new UploadApi();



        $data = $request->validate([
            'mode' => 'required|string',
            'dateStart' => 'required|date',
            'timeStart' => 'required',
            'duration' => 'nullable|string',
            'title' => 'required|string',
            'place' => 'required|string',
            'description' => 'required|string',
            'contributor' => 'nullable|string',
            'image' => 'nullable|image|max:3072',
        ]);
        
        if ($request->hasFile('image')) {
            $result = $upload->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'Events/talleres',
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true
                ]
            );
            $data['image'] = $result['secure_url']; //guarda la URL de Cloudinary
        }
        Taller::create($data);
        return redirect()->route('taller')->with('success', 'Taller creado');
    }

    public function edit($id)
    {
        $taller = Taller::findOrFail($id);
        return view('Talleres.updateTaller', compact('taller'));
    }

    public function update(Request $request, $id)
    {
        $upload = new UploadApi();

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
            'image' => 'nullable|image|max:3072',

        ]);
        if ($request->hasFile('image')) {
            // Subir la nueva imagen a Cloudinary
            $result = $upload->upload(
                $request->file('image')->getRealPath(),
                [
                    'folder' => 'Events/talleres',
                    'use_filename' => true,
                    'unique_filename' => true,
                    'overwrite' => true
                ]
            );

            $data['image'] = $result['secure_url']; // ✅ URL de Cloudinary
        }

        $taller->update($data);
        return redirect()->route('taller')->with('success', 'Taller actualizado');
    }

    public function destroy(Request $request)
    {
        $taller = Taller::findOrFail($request->taller_id);
        $taller->delete();
        return redirect()->route('taller')->with('success', 'Taller eliminado');
    }
}
