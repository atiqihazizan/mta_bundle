<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MapTitle extends Model
{
	use HasFactory;

	protected $fillable = ['text', 'x', 'y', 'font_size', 'color', 'bg_color', 'visible'];

	protected $casts = [
		'visible' => 'boolean',
	];

	public static function current(): self
	{
		return static::first() ?? static::create([]);
	}
}