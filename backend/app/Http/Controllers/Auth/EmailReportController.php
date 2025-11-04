<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\BrevoMailer;

class EmailReportController extends Controller
{
    

    /**
     * Recibe el reporte de un usuario y envía un correo al administrador.
     */
    public function sendReport(Request $request)
    {
        // Validación del formulario
        $request->validate([
            'name' => 'required|in:Report,Suggestion', // Asegúrate de que solo acepte "Report" o "Suggestion"
            'email' => 'required|email', // Valida que sea un correo válido
            'message' => 'required|string|min:10', // El mensaje debe tener al menos 10 caracteres
        ]);

        // Correo del administrador
        $adminEmail = env('MAIL_FROM_ADDRESS', 'admin@harixom.com');

        // Contenido del correo
        $html = "
            <h2>Nuevo reporte de problema</h2>
            <p><strong>Tipo de reporte:</strong> {$request->name}</p>
            <p><strong>Correo del usuario:</strong> {$request->email}</p>
            <p><strong>Mensaje:</strong></p>
            <p>{$request->message}</p>
            <hr>
            <p>Enviado desde el sistema Harixom</p>
        ";

        try {
            Log::info('Intentando enviar correo a: ' . $adminEmail);
            BrevoMailer::send(
                $adminEmail,
                "Nuevo reporte de problema - Reporte de {$request->email}",
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
