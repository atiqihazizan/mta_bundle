<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkpoint extends Model
{
	use HasFactory;

	protected $fillable = ['name', 'label', 'label_color', 'icon', 'lat', 'lng', 'route_id', 'visible'];

	protected $casts = [
		'visible' => 'boolean',
	];
}