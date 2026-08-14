<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
	use HasFactory;
	protected $fillable = ['bis_id', 'total', 'vno', 'vdate', 'remark', 'created_at', 'description', 'details','updated_at', 'created_by', 'updated_by'];
	protected $casts = [
		'vdate' => 'date'
	];

	public function people()
	{
		return $this->belongsTo(Business::class, 'bis_id');
	}
}
