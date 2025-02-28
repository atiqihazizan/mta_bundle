<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kariah extends Model
{
	use HasFactory;

	protected $fillable  = ['status',	'relation',	'tanggungan',	'penama','created_at', 'updated_at','created_by', 'updated_by'];
	protected $with = ['sibling', 'sts', 'people', 'people.healthy', 'people.married', 'people.education', 'people.job'];

	public function people()
	{
		return $this->belongsTo(Peoples::class, 'ppl_id');
	}
	public function address()
	{
		return $this->belongsTo(Address::class, 'addr_id');
	}
	public function sibling()
	{
		return $this->belongsTo(StatusRelation::class, 'relation');
	}
	public function sts()
	{
		return $this->belongsTo(StatusPenghuni::class, 'status');
	}
}
