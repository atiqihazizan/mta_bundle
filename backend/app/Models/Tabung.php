<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Tabung extends Model
{
	use HasApiTokens, HasFactory;

	protected $fillable = ['dateTime', 'ttype', 'total', 't100', 't50', 't20', 't10', 't5', 't1', 'others', 'remark','voucher','created_at', 'updated_at'];

	protected $casts = [
		'dateTime' => 'date'
	];

	public function TypeTabung()
	{
		$type = ['', 'Tabung Statik','Tabung Jumaat',  'Tabung Mingguan'];
		return $type[$this->ttype];
	}
}
