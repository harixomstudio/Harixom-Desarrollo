<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        'name' => 'required|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'phone' => ['nullable','string','max:20','regex:/^\+\d{1,3}\d{4,14}$/'],
        'address' => 'required|max:255',
        'password' => 'required|min:6|max:255',
        'description' => 'nullable|string|max:500',
        'profile_picture' => 'nullable|image|max:2048',
        'banner_picture' => 'nullable|image|max:4096',
    ];
}

    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.max' => 'The name field must be at most 255 characters long',

             'phone.regex' => 'El número de teléfono debe iniciar con + y contener solo números. Ej: +50688881234',

            'email.required' => 'The email field is required.',
            'email.email' => 'The email field must be a valid email address',
            'email.max' => 'The email field must be at most 255 characters long',
            'password.required' => 'The password field is required.',
            'password.min' => 'The password field must be at least 6 characters long',
            'password.max' => 'The password field must be at most 255 characters long'
        ];
    }
}
