<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jenazah extends Model
{
	use HasFactory;
	protected $fillable = ['people_id', 'jdate', 'lorong', 'lubang', 'cost', 'type', 'alamat', 'name', 'created_at', 'updated_at','created_by', 'updated_by'];
	protected $casts = ['jdate' => 'date'];
	// protected $with = ['sibling', 'sts', 'people', 'people.healthy', 'people.married', 'people.education', 'people.job'];

	function people(){

	}
	function pengurusan(){
		if($this->type == 1) return 'Masjid';
		else if ($this->type == 2) return 'Hospital';
		return '';
	}
}
