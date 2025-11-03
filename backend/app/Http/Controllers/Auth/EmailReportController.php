<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\BrevoMailer;

class ReportController extends Controller
{
    /**
     * Recibe el reporte de un usuario y envía un correo al administrador.
     */
    public function sendReport(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string|min:10',
        ]);

        $adminEmail = env('MAIL_FROM_ADDRESS', 'harixomstudio@gmail.com');

        $html = "
            <h2>Nuevo reporte de problema</h2>
            <p><strong>Nombre:</strong> {$request->name}</p>
            <p><strong>Correo:</strong> {$request->email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>{$request->message}</p>
            <hr>
            <p>IP del usuario: " . $request->ip() . "</p>
            <p>User Agent: " . $request->header('User-Agent') . "</p>
            <p>Enviado desde el sistema Harixom</p>
        ";

        try {
            BrevoMailer::send(
                $adminEmail,
                "Nuevo reporte de problema - Harixom",
                $html
            );

            return response()->json([
                'message' => 'Tu reporte ha sido enviado. Gracias por comunicarte.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error al enviar reporte: ' . $e->getMessage());

            return response()->json([
                'error' => 'Hubo un error al enviar el reporte. Intenta más tarde.'
            ], 500);
        }
    }
}
