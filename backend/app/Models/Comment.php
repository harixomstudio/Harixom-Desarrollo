<?php

// app/Models/Comment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{

    protected static function booted()
{
    static::created(function ($comment) {
        $comment->publication()->increment('comments_count');
    });

    static::deleted(function ($comment) {
        $comment->publication()->decrement('comments_count');
    });
}

    protected $fillable = ['user_id', 'publication_id', 'comment'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function publication() {
        return $this->belongsTo(Publication::class);
    }
}
