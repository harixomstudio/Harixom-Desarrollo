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

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Scope para excluir publicaciones de usuarios bloqueados
     */
    public function scopeWithoutBlocked($query, $user = null)
    {
        // Si no hay usuario autenticado, no aplicar el filtro
        if (!$user) {
            return $query;
        }

        // Obtener IDs de usuarios bloqueados y bloqueadores
        $blockedUserIds = $user->blockedUsers()->pluck('blocked_user_id')->toArray();
        $blockedByUserIds = $user->blockedByUsers()->pluck('user_id')->toArray();

        // Unir ambos arrays para excluirlos
        $excludedUserIds = array_unique(array_merge($blockedUserIds, $blockedByUserIds));

        return $query->when(!empty($excludedUserIds), function ($q) use ($excludedUserIds) {
            $q->whereNotIn('user_id', $excludedUserIds);
        });
    }
}
