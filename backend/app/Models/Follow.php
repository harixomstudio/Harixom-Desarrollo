<?php

// app/Models/Follow.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $fillable = ['follower_id', 'following_id'];

    public function follower() {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function following() {
        return $this->belongsTo(User::class, 'following_id');
    }

    public function follows() {
    return $this->hasMany(\App\Models\Follow::class, 'follower_id');
}

public function followers() {
    return $this->hasMany(\App\Models\Follow::class, 'following_id');
}
}
