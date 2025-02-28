<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Peoples extends Model
{
	use HasFactory;

	protected $fillable = ['name', 'nickname', 'nokp', 'mobile', 'married_id', 'job_id', 'edu_id', 'health_id', 'stshealthy', 'penyakit', 'stspencen', 'pencen', 'created_by', 'updated_by', 'created_at', 'updated_at'];

	public function healthy()
	{
		return $this->belongsTo(StatusHealth::class, 'health_id');
	}

	public function married()
	{
		return $this->belongsTo(StatusMarriage::class, 'married_id');
	}

	public function education()
	{
		return $this->belongsTo(StatusEducations::class, 'edu_id');
	}

	public function job()
	{
		return $this->belongsTo(StatusJob::class, 'job_id');
	}
}
