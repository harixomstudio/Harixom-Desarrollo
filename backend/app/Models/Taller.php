<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Taller extends Model
{
    use HasFactory;

    protected $fillable = [
        'mode',
        'dateStart',
        'timeStart',
        'contributor',
        'image',
        'title',
        'place',
        'duration',
        'description',
    ];
}
