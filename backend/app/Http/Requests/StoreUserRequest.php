<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'max:255', 'regex:/^[^\s]+$/'],
            'email' => [
    'required',
    'email',
    'max:255',
    'unique:users,email',
    'regex:/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/'
],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^\+\d{1,4}\d{8,12}$/'],
            'address' => ['required', 'max:255'],
            'password' => [
                'required',
                'string',
                'min:8',
                'max:255',
                // Al menos una mayúscula, una minúscula, un número y un carácter especial
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,;:#^()\-_=+{}[\]<>]).{8,}$/'
            ],
            'description' => ['nullable', 'string', 'max:500'],
            'profile_picture' => ['nullable', 'image', 'max:2048'],
            'banner_picture' => ['nullable', 'image', 'max:4096'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.max' => 'The name field must be at most 255 characters long.',
            'email.regex' => 'The email must contain a valid domain (e.g., example@gmail.com).',
            'name.regex' => 'The name field cannot contain spaces.',
            'phone.regex' => 'The phone number must contain only numbers, and have no spaces. Ex: 88881234',
            'email.required' => 'The email field is required.',
            'email.email' => 'The email field must be a valid email address.',
            'email.max' => 'The email field must be at most 255 characters long.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'The password field is required.',
            'password.min' => 'The password must be at least 8 characters long.',
            'password.max' => 'The password must be at most 255 characters long.',
            'password.regex' => 'The password must include at least one uppercase letter, one lowercase letter, one number, and one special character.',
        ];
    }
}
