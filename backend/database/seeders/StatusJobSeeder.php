<?php

namespace Database\Seeders;

use App\Models\StatusJob;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusJobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Sendiri'],
            ["name" => 'Suri Rumah'],
            ["name" => 'Belum Bekerja'],
            ["name" => 'Pos Malaysia'],
            ["name" => 'Kilang'],
            ["name" => 'Polis'],
            ["name" => 'Telekom'],
            ["name" => 'Guru Tabika'],
            ["name" => 'Jurutera'],
            ["name" => 'Guru'],
            ["name" => 'Akauntan'],
            ["name" => 'TNB'],
            ["name" => 'Kerani'],
            ["name" => 'MBSB'],
            ["name" => 'Swasta'],
            ["name" => 'Penjawat Awam'],
            ["name" => 'PBA'],
            ["name" => 'Tukang Masak'],
            ["name" => 'Office Admin']
        ];
        collect($arr)->each(function ($a) {
            StatusJob::create($a);
        });
    }
}
