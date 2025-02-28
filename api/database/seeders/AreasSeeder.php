<?php

namespace Database\Seeders;

use App\Models\Areas;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AreasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["aname" => 'Surau Bakmi'],
            ["aname" => 'Surau HJ Puteh'],
            ["aname" => 'Suaru Al Mansor'],
            ["aname" => 'Masjid Tuan Abdullah'],
        ];
        collect($arr)->each(function ($a) {
            Areas::create($a);
        });
    }
}
