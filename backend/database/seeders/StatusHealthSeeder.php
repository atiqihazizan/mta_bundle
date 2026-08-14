<?php

namespace Database\Seeders;

use App\Models\StatusHealth;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusHealthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Sihat'],
            ["name" => 'Sakit'],
            ["name" => 'Sakit berpanjangan'],
            ["name" => 'Sakit Tua'],
            ["name" => 'Penyakit Kekal'],
            ["name" => 'Strok']
        ];
        collect($arr)->each(function ($a) {
            StatusHealth::create($a);
        });
    }
}
