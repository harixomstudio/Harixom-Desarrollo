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

    public function profilePicturePath()
{
    if($this->profile_picture){
        return asset('storage/images/users/'.$this->profile_picture);
    } else {
        return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    }
}

public function bannerPicturePath()
{
    if($this->banner_picture){
        return asset('storage/images/users/'.$this->banner_picture);
    } else {
        return 'https://via.placeholder.com/1200x300/444/fff?text=Banner';
    }
}

}
