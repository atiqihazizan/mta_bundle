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
        Schema::create('tabungs', function (Blueprint $table) {
            $table->id();
						$table->datetime('dateTime')->nullable();
						$table->tinyInteger('ttype')->default(1)->comment('1:tabung jumaat 2:tabung statik');
						$table->decimal('total',10,2)->default(0);
						$table->decimal('t100',10,2)->default(0);
						$table->decimal('t50',10,2)->default(0);
						$table->decimal('t20',10,2)->default(0);
						$table->decimal('t10',10,2)->default(0);
						$table->decimal('t5',10,2)->default(0);
						$table->decimal('t1',10,2)->default(0);
						$table->string('ref')->nullable();
						$table->string('voucher')->nullable();
						$table->string('remark')->nullable();
						$table->json('others')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tabungs');
    }
};
