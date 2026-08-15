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
        Schema::table('perarakans', function (Blueprint $table) {
            $table->integer('map_zoom')->default(15)->after('distance');
            $table->decimal('map_lat', 10, 7)->nullable()->after('map_zoom');
            $table->decimal('map_lng', 10, 7)->nullable()->after('map_lat');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('perarakans', function (Blueprint $table) {
            $table->dropColumn(['map_zoom', 'map_lat', 'map_lng']);
        });
    }
};