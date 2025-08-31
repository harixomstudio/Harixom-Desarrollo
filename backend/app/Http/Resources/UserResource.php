<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
     public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'description' => $this->description,
            'profile_picture' => $this->profilePicturePath(),
            'banner_picture' => $this->bannerPicturePath(),
            'is_active' => $this->is_active,
            'profile_completed' => $this->profile_completed,
            'posts' => $this->posts()->get()->map(function ($post) {
    return [
        'description' => $post->description,
        'image' => $post->image ? url($post->image) : null,
        'created_at' => $post->created_at, 
    ];
}),
        ];
    }
}
