<?php

namespace Database\Seeders;

use App\Models\StatusRumah;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusRumahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Tiada Penghuni'],
            ['name' => 'Penghuni Islam'],
            ['name' => 'Penghuni Bukan Islam']
        ];
        collect($arr)->each(function ($a) {
            StatusRumah::create($a);
        });
    }
}
