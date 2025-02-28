<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;
		protected $fillable = ['addr', 'addr2', 'addr3', 'poskod', 'area_id','cares_id', 'created_at', 'updated_at','created_by', 'updated_by'];

    public function orang()
    {
        return $this->hasMany(Kariah::class, 'addr_id');
    }

    public function area()
    {
        return $this->belongsTo(Areas::class, 'area_id');
    }

    public function ketua()
    {
        return $this->belongsTo(Peoples::class, 'head_id');
    }
}
