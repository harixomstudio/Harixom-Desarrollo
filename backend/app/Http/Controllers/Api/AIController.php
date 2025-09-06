<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function getChallenge(Request $request)
{
    $specialty = $request->input('specialty');

if (!$specialty) {
    return response()->json([
        'error' => 'La especialidad es requerida'
    ], 422); // 422 Unprocessable Entity
}

    try {
    $response = Http::withHeaders([
        'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
        'Content-Type' => 'application/json',
    ])->post('https://api.openai.com/v1/responses', [
        'model' => 'gpt-5-nano',
        'input' => "Genera un reto creativo para la especialidad: $specialty",
        'store' => true,
    ]);

    $data = $response->json();

    if (isset($data['error'])) {
        return response()->json([
            'error' => $data['error']['message'] ?? 'Error de OpenAI',
            'code' => $data['error']['code'] ?? null,
        ], 400);
    }

    return response()->json([
        'challenge' => $data['output_text'] ?? 'No se generó un reto',
    ]);

} catch (\Exception $e) {
    return response()->json([
        'error' => 'Error al comunicarse con OpenAI',
        'details' => $e->getMessage(),
    ], 500);
}
}
}
