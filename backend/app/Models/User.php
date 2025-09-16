<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'address',
        'phone',
        'profile_completed',
        'profile_picture',
        'banner_picture',
        'description',
        'is_active',
    ];

    public function isActive()
{
    return $this->is_active;
}

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function posts()
{
    return $this->hasMany(\App\Models\Publication::class); // Ajusta el modelo según tu tabla
}

public function likes() {
    return $this->hasMany(Like::class);
}

public function follows() {
    return $this->hasMany(Follow::class, 'follower_id');
}

public function followers() {
    return $this->hasMany(Follow::class, 'following_id');
}

public function comments() {
    return $this->hasMany(Comment::class);
}

    public function profilePicturePath()
{
    return $this->profile_picture 
        ? asset($this->profile_picture)
        : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
}

    
public function bannerPicturePath()
{
    return $this->banner_picture 
        ? asset($this->banner_picture)
        : 'https://img.freepik.com/foto-gratis/fondo-textura-abstracta_1258-30553.jpg?semt=ais_incoming&w=740&q=80';
}
}

