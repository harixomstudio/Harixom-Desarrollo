<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
        $table->id();
        $table->string('type');              // Tipo de evento (ejemplo: taller, conferencia, etc.)
        $table->string('title');             // Título del evento
        $table->text('description')->nullable(); // Descripción
        $table->date('dateStart');           // Fecha de inicio
        $table->time('timeStart');           // Hora de inicio
        $table->date('dateEnd');             // Fecha de fin
        $table->time('timeEnd');             // Hora de fin
        $table->timestamps();                // created_at y updated_at
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
