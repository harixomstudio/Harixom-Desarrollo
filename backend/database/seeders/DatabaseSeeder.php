<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //User::factory(10)->create();

        /*User::factory()->create([
            'name' => 'Alice Wonder',
            'email' => 'alice@example.com',
            'phone' => '555-1234',
            'address' => '123 Fantasy St',
            'image' => null,
            'profile_completed' => true,
            'password' => bcrypt('password123'),
        ]);

        User::factory()->create([
            'name' => 'Bob Builder',
            'email' => 'bob@example.com',
            'phone' => '555-5678',
            'address' => '456 Construction Rd',
            'image' => null,
            'profile_completed' => false,
            'password' => bcrypt('password123'),
        ]);*/

        $this->call([
            AdminSeeder::class
        ]);
    }
}
