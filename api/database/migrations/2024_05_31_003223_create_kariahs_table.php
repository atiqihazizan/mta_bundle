<?php

use App\Models\Address;
use App\Models\Peoples;
use App\Models\StatusPenghuni;
use App\Models\StatusRelation;
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
        Schema::create('kariahs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Peoples::class, 'ppl_id')->nullable()->comment('people id');
            $table->foreignIdFor(Address::class, 'addr_id')->nullable();
            $table->foreignIdFor(StatusRelation::class, 'relation')->nullable()->comment('relation/hubungan');
            $table->foreignIdFor(StatusPenghuni::class, 'status')->nullable()->comment('status ketua rumah 1:ketua 2:pasangan 3:lain-lain');

            $table->boolean('tanggungan')->default(false);
            $table->boolean('solatjemaah')->nullable()->default(true);
            $table->boolean('penama')->nullable()->default(false);

            $table->foreignIdFor(User::class, 'created_by')->nullable()->nullOnDelete();
            $table->foreignIdFor(User::class, 'updated_by')->nullable()->nullOnDelete();
            // $table->unsignedBigInteger('created_by')->nullable();
            // $table->foreign('created_by')->references('id')->on('users');
            // $table->unsignedBigInteger('updated_by')->nullable();
            // $table->foreign('updated_by')->references('id')->on('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kariahs');
    }
};
