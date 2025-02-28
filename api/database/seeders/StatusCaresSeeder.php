<?php

namespace Database\Seeders;

use App\Models\StatusCares;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusCaresSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Jabatan Kebajikan'],
            ["name" => 'Zakat'],
        ];
        collect($arr)->each(function ($a) {
            StatusCares::create($a);
        });
    }
}
