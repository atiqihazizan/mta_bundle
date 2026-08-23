<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('directions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('coords')->nullable();
            $table->double('distance', 10, 2)->default(0);
            $table->integer('duration')->default(0);
            $table->text('instructions')->nullable();
            $table->timestamps();

            $table->index(['name', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::table('directions', function (Blueprint $table) {
            // $table->dropIndex(['name', 'user_id']);
        });

        Schema::dropIfExists('directions');
    }
};