<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lookup extends Model
{
    protected $fillable = ['name', 'type'];

    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }
}
