<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = [
        'user_id',
        'image',
        'description',
        'category',
        'uploaded_at',
    ];

    // Relación con el usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes() {
    return $this->hasMany(Like::class);
}

public function comments() {
    return $this->hasMany(Comment::class);
}
}
