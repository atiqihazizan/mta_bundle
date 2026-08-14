<?php

use App\Models\Peoples;
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
		Schema::create('jenazahs', function (Blueprint $table) {
			$table->id();
			$table->foreignIdFor(Peoples::class, 'people_id');
			$table->date('jdate');
			$table->integer('lorong')->default(0);
			$table->integer('lubang')->default(0);
			$table->decimal('cost', 10, 2)->default(0);
			$table->tinyInteger('type')->default(0)->comment('diurus oleh 1:masjid 2:hospital');
			$table->string('alamat')->nullable();
			$table->string('name')->nullable();
			$table->foreignIdFor(User::class,'created_by')->default(0);
			$table->foreignIdFor(User::class,'updated_by')->default(0);
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('jenazahs');
	}
};
