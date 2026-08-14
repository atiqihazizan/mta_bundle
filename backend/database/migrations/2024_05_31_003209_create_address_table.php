<?php

use App\Models\Areas;
use App\Models\Peoples;
use App\Models\StatusCares;
use App\Models\StatusIncome;
use App\Models\StatusRumah;
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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Areas::class, 'area_id');
            $table->foreignIdFor(StatusRumah::class)->nullable()->comment('1: tiada penghuni 2:islam 3:non-muslim');
            $table->foreignIdFor(StatusCares::class, 'cares_id')->comment('bantuan/peduli');
            $table->foreignIdFor(StatusIncome::class, 'pendapatan_id')->default(0);

            $table->foreignIdFor(Peoples::class, 'head_id')->nullable()->comment('ketua rumah')->nullOnDelete();
            $table->foreignIdFor(Peoples::class, 'assist_id')->nullable()->comment('pasangan/wakil')->nullOnDelete();
            // $table->unsignedBigInteger('assist_id')->nullable();
            // $table->foreign('assist_id')->references('id')->on('peoples');

            $table->boolean('khairat')->default(false);
            $table->string("addr", 70)->nullable()->comment('unit/blok');
            $table->string('addr2', 100)->nullable()->comment('mukim/jalan');
            $table->string('addr3', 100)->nullable()->comment('kampung/bandar');
            $table->string('poskod', 100)->nullable();
            $table->string('jenisbantuan', 120)->nullable();
            $table->string('latlng', 25)->nullable();
            $table->tinyInteger('rev')->default(1)->comment('bilangan bancian yang dah buat');
            $table->decimal("paid", 10, 2)->default(0)->comment("Paid for bancian");

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
        Schema::dropIfExists('address');
    }
};
