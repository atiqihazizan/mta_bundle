<?php

namespace Database\Seeders;

use App\Models\StatusMarriage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusMarriageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Bujang'],
            ["name" => 'Berkahwin'],
            ["name" => 'Duda'],
            ["name" => 'Janda'],
            ["name" => 'Ibu Tunggal']
        ];
        collect($arr)->each(function ($a) {
            StatusMarriage::create($a);
        });
    }
}
