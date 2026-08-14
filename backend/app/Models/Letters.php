<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Letters extends Model
{
	use HasApiTokens, HasFactory;

	protected $fillable = ['rcvd_at', 'ltdue', 'ltdate', 'ltdesc', 'lfrom', 'chairman_act', 'biro_act','lactive', 'remark', 'created_at', 'updated_at'];

	protected $casts = ['rcvd_at' => 'date','ltdue' => 'date','ltdate' => 'date'];
}
