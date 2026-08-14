<?php

namespace Database\Seeders;

use App\Models\StatusPenghuni;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusPenghuniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Ketua Rumah'],
            ["name" => 'Pasangan'],
            ["name" => 'Lain-lain']
        ];
        collect($arr)->each(function ($a) {
            StatusPenghuni::create($a);
        });
    }
}
