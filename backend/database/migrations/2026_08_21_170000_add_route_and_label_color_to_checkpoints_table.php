<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('checkpoints', function (Blueprint $table) {
            $table->foreignId('route_id')->nullable()->constrained('perarakans')->onDelete('cascade');
            $table->string('label_color')->default('#ffffff');
        });
    }

    public function down(): void
    {
        Schema::table('checkpoints', function (Blueprint $table) {
            $table->dropForeign(['route_id']);
            $table->dropColumn(['route_id', 'label_color']);
        });
    }
};