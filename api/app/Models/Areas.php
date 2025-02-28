<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Areas extends Model
{
    use HasFactory;

    public function address()
    {
        return $this->belongsTo(Address::class, 'area_id');
    }
}
