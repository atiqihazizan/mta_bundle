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
		Schema::create('letters', function (Blueprint $table) {
			$table->id();
			$table->date('rcvd_at')->nullable()->comment('tarikh terima');
			$table->date('ltdue')->nullable()->comment('tarikh kena siap/selesai');
			$table->date('ltdate')->nullable()->comment('tarikh surat');
			$table->boolean('lactive')->nullable();
			$table->string('ltdesc')->nullable()->comment('keterangan');
			$table->string('lfrom')->nullable()->comment('surat daripada');
			$table->string('chairman_act')->nullable()->comment('untuk tindakan pengerusi');
			$table->string('biro_act')->nullable()->comment('untuk tindakan biro');
			$table->string('remark')->nullable();
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void
	{
		Schema::dropIfExists('letters');
	}
};
