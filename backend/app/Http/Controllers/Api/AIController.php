<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIController extends Controller
{
    public function getChallenge(Request $request)
    {
        $specialty = $request->input('specialty');

        if (!$specialty) {
            return response()->json([
                'error' => 'La especialidad es requerida'
            ], 422);
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])->timeout(60)
              ->post('https://api.openai.com/v1/responses', [
                  'model' => 'gpt-4.1-mini',
                  'input' => "Genera un reto creativo para la especialidad: $specialty",
              ]);

            $data = $response->json();

            // Logueamos la respuesta completa de OpenAI
            Log::info('OpenAI response:', $data);

            if (isset($data['error'])) {
                Log::error('OpenAI returned an error:', $data['error']);
                return response()->json([
                    'error' => $data['error']['message'] ?? 'Error de OpenAI',
                    'code' => $data['error']['code'] ?? null,
                ], 400);
            }

            // Logueamos el campo que usamos para challenge
            Log::info('Output text:', [
                'output_text' => $data['output_text'] ?? null
            ]);

            $challenge = $data['output'][0]['content'][0]['text'] ?? 'No se generó un reto';

            return response()->json([
    'challenge' => $challenge,
    'full_response' => $data, // opcional para debug
]);

        } catch (\Exception $e) {
            Log::error('Error al comunicarse con OpenAI:', ['exception' => $e]);
            return response()->json([
                'error' => 'Error al comunicarse con OpenAI',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
}
