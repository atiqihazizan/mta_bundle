<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    use HasFactory;

		protected $fillable = ['name','regno','phone','address', 'created_at', 'updated_at'];
}
