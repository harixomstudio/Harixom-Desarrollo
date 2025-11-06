<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    Schema::table('subscriptions', function (Blueprint $table) {
        $table->decimal('amount', 8, 2)->nullable()->after('plan_type');
        $table->string('currency', 10)->default('usd')->after('amount');
        $table->dateTime('start_date')->nullable()->after('currency');
        $table->dateTime('end_date')->nullable()->after('start_date');
    });
}

public function down(): void
{
    Schema::table('subscriptions', function (Blueprint $table) {
        $table->dropColumn(['amount', 'currency', 'start_date', 'end_date']);
    });
}
};
