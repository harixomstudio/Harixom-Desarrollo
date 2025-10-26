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
        Schema::table('likes', function (Blueprint $table) {
            $table->string('for_user_id')->nullable()->after('id');
            $table->string('title')->nullable()->after('for_user_id');
            $table->string('status')->nullable()->after('publication_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('likes', function (Blueprint $table) {
            $table->dropColumn('for_user_id');
            $table->dropColumn('title');
            $table->dropColumn('status');
        });
    }
};
