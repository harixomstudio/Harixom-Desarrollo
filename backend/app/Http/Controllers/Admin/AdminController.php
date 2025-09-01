<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AuthAdminRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;



class AdminController extends Controller
{
    //
    public function index(){
        $users = User::all(); // Trae todos los usuarios
        return view('admin.index', compact('users'));
    }

    //
    public function login(){
        return view('admin.login');
    }

    //
    public function auth(AuthAdminRequest $request){
        $credentials = $request->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials)) {
        $request->session()->regenerate();
        return redirect()->route('admin.index');
}
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    //
    public function enable($id) {
    $user = User::findOrFail($id);

    if ($user->is_active) {
        return back()->with('error', 'El usuario ya está activo.');
    }
    $user->is_active = true;
    $user->save();
    
    return back()->with('success', 'Usuario activado correctamente.');
}

//
public function disable($id) {
    $user = User::findOrFail($id);

    if (!$user->is_active) {
        return back()->with('error', 'El usuario ya está deshabilitado.');
    }
    $user->is_active = false;
    $user->save();

    return back()->with('success', 'Usuario deshabilitado correctamente.');
}

    //
    public function create()
{
    return view('admin.createUser');
}

    //
    public function logout(Request $request)
{
    Auth::guard('admin')->logout(); // Cierra sesión del admin
    $request->session()->invalidate(); // Invalida la sesión
    $request->session()->regenerateToken(); // Regenera el CSRF token

    return redirect()->route('admin.login'); // Redirige al login
}

}
