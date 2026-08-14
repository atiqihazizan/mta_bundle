<?php

namespace Database\Seeders;

use App\Models\StatusIncome;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusIncomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Tiada Pendapatan'],
            ["name" => '2000 Kebawah'],
            ["name" => '2000 - 5000'],
            ["name" => '5000 dan keatas'],
        ];
        collect($arr)->each(function ($a) {
            StatusIncome::create($a);
        });
    }
}
