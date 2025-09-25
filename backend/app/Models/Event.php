<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'title',
        'description',
        'dateStart',
        'timeStart',
        'dateEnd',
        'timeEnd',
    ];
}
