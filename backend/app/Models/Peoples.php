<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Peoples extends Model
{
	use HasFactory;

	protected $fillable = ['name', 'nickname', 'nokp', 'mobile', 'married_id', 'job_id', 'edu_id', 'health_id', 'stshealthy', 'penyakit', 'stspencen', 'pencen', 'created_by', 'updated_by', 'created_at', 'updated_at'];

	protected static function boot()
	{
		parent::boot();
		
		static::creating(function ($model) {
			$model->created_by = Auth::id();
			$model->updated_by = Auth::id();
		});

		static::updating(function ($model) {
			$model->updated_by = Auth::id();
		});

		static::updated(function ($model) {
			// Update kariah records when people is updated
			$kariahs = $model->kariah;
			foreach ($kariahs as $kariah) {
				$kariah->updated_by = Auth::id();
				$kariah->save();
			}
		});

		static::deleting(function ($model) {
			// Delete all related kariah records first
			$model->kariah()->delete();
		});
	}

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

	public function kariah()
	{
		return $this->hasMany(Kariah::class, 'ppl_id');
	}
}
