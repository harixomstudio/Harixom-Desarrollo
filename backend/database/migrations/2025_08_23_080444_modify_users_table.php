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
        Schema::table('users', function (Blueprint $table) {
            // Eliminar la columna 'image'
            if (Schema::hasColumn('users', 'image')) {
                $table->dropColumn('image');
            }

            // Agregar columnas nuevas
            $table->string('profile_picture')->nullable()->after('address');
            $table->string('banner_picture')->nullable()->after('profile_picture');
            $table->text('description')->nullable()->after('banner_picture');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revertir cambios
            $table->string('image')->nullable()->after('address');
            $table->dropColumn(['profile_picture', 'banner_picture', 'description']);
        });
    }
};
