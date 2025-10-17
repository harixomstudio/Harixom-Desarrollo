<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'blocked_user_id'];

    public function blocker() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function blocked() {
        return $this->belongsTo(User::class, 'blocked_user_id');
    }

    public function blockedUsers() {
    return $this->belongsToMany(User::class, 'blocked_users', 'user_id', 'blocked_user_id');
}
}