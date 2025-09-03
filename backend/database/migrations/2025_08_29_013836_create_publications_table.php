<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('publications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relación con usuarios
            $table->string('image')->nullable(); // ruta de la imagen
            $table->text('description')->nullable();
            $table->string('category')->nullable();
            $table->timestamp('uploaded_at')->useCurrent(); // fecha de subida
            $table->timestamps(); // created_at & updated_at
        });
    }

    public function down(): void {
        Schema::dropIfExists('publications');
    }
};
