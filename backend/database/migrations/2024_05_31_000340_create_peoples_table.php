<?php

use App\Models\StatusCares;
use App\Models\StatusEducations;
use App\Models\StatusHealth;
use App\Models\StatusJob;
use App\Models\StatusMarriage;
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
        Schema::create('peoples', function (Blueprint $table) {
            $table->id();
            $table->string("nokp", 20)->unique();
            $table->string("name", 150);
            $table->string("nickname", 50)->nullable();
            $table->string("mobile", 15)->nullable(true)->comment('tel bimbit');
            $table->string("home", 15)->nullable(true)->comment('tel rumah');
            $table->tinyInteger("gender")->default(0)->comment('1:male 2:female');
            $table->tinyInteger('stsmenetap')->default(1)->comment('1:mustautin 2:mukim 3:luar');
            $table->tinyInteger('nation')->default(1)->comment('1:melayu 2:cina 3:india');
            $table->boolean('religion')->default(true)->comment('1:islam 0:bukan islam');
            // $table->unsignedBigInteger('edu_id')->index()->nullable();
            // $table->foreign('edu_id')->references('id')->on('status_educations')->onDelete('cascade');
            // $table->unsignedBigInteger('job_id')->index()->nullable();
            // $table->foreign('job_id')->references('id')->on('status_jobs')->onDelete('cascade');
            $table->foreignIdFor(StatusEducations::class, 'edu_id');
            $table->foreignIdFor(StatusJob::class, 'job_id');
            $table->foreignIdFor(StatusHealth::class, 'health_id');
            $table->foreignIdFor(StatusCares::class, 'cares_id')->comment('bantuan/peduli');
            $table->foreignIdFor(StatusMarriage::class, 'married_id');
            $table->boolean('stspencen')->nullable()->default(0);
            $table->string('pencen', 30)->nullable();
            $table->boolean('stshealthy')->default(1);
            $table->string('penyakit', 150)->nullable();
            $table->unsignedBigInteger('bancian')->index()->nullable();
            $table->foreign('bancian')->references('id')->on('users');

				$table->boolean('asnaf')->default(false);
				$table->boolean('khairat')->default(false);
				$table->boolean('dead')->default(1)->comment('0:sudah meninggal 1:belum meninggal');
				$table->dateTime('death_dt')->nullable();

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
        Schema::dropIfExists('peoples');
    }
};
