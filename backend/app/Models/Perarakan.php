<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Perarakan extends Model
{
	use HasFactory;

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
	}

	protected $fillable = ['name', 'visible', 'coords', 'distance', 'created_by', 'updated_by'];

	protected $casts = [
		'coords' => 'array',
		'visible' => 'boolean',
	];
}
