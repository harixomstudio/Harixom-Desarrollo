<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('services')->nullable()->after('description');
            $table->text('prices')->nullable()->after('services');
            $table->text('terms')->nullable()->after('prices');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['services', 'prices', 'terms']);
        });
    }
};