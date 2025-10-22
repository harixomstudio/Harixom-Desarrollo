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
            'buymeacoffee_link' => $this->buymeacoffee_link,
            'address' => $this->address,
            'description' => $this->description,
            'profile_picture' => $this->profilePicturePath(),
            'banner_picture' => $this->bannerPicturePath(),
            'is_active' => $this->is_active,
            'services' => $this->services,
            'prices' => $this->prices,
            'terms' => $this->terms,
            'commissions_enabled' => $this-> commissions_enabled,
            'profile_completed' => $this->profile_completed,
            'is_premium' => $this->is_premium,
            'stripe_subscription_id' => $this->stripe_subscription_id,
            'posts' => $this->posts()->get()->map(function ($post) {
        
    return [
        'id' => $post->id,
        'description' => $post->description,
        'image' => $post->image ? url($post->image) : null,
        'created_at' => $post->created_at,
         
    ];
}),
        ];
    }
}
