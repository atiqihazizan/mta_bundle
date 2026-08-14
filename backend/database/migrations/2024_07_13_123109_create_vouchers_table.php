<?php

use App\Models\Business;
use App\Models\User;
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
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Business::class,'bis_id');
						$table->string('vno',10)->nullable();
						$table->decimal('total',10,2);
						$table->date('vdate');
						$table->string('description')->nullable();
						$table->string('remark')->nullable();
						$table->json('details')->nullable();
            $table->foreignIdFor(User::class,'created_by');
            $table->foreignIdFor(User::class,'updated_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
