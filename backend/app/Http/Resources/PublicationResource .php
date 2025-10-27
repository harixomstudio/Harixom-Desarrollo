<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PublicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'category' => $this->category,
            'image' => $this->image ?: null,
            'created_at' => $this->created_at,
            'user_name' => $this->user ? $this->user->name : "Usuario",
            'user_profile' => $this->user && $this->user->profile_photo
                ? asset('storage/profiles/' . $this->user->profile_photo)
                : null,
                'isPremium' => $this->user ? (bool) $this->user->is_premium : false,
        ];
    }
}
