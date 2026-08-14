<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            [
                "username" => 'atiqi', 'name' => 'Admin', "password" => Hash::make("123456"), 'forgot_pass' => '123456',
                'remember_token' => Str::random(10)
            ],
            [
                "username" => 'farid', 'name' => 'Farid TMP', "password" => Hash::make("123456"), 'forgot_pass' => '123456',
                'remember_token' => Str::random(10)
            ],
            [
                "username" => 'afifah', 'name' => 'Afifah Zakaria', "password" => Hash::make("123456"), 'forgot_pass' => '123456',
                'remember_token' => Str::random(10)
            ],
        ];
        collect($arr)->each(function ($a) {
            User::create($a);
        });
    }
}
