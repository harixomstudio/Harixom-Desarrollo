<?php

// app/Models/Comment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'publication_id', 'comment'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function publication() {
        return $this->belongsTo(Publication::class);
    }
}
