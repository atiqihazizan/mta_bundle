<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('map_titles', function (Blueprint $table) {
            $table->id();
            $table->string('text')->default('PETA LALUAN PERARAKAN');
            $table->double('x', 5, 2)->default(50);
            $table->double('y', 5, 2)->default(3);
            $table->integer('font_size')->default(16);
            $table->string('color')->default('#1e293b');
            $table->string('bg_color')->default('#fbbf24');
            $table->boolean('visible')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('map_titles');
    }
};