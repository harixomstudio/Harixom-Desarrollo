<?php

// database/migrations/xxxx_create_likes_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('publication_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['user_id', 'publication_id']); // Un usuario solo puede dar like 1 vez
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};

