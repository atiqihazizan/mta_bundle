<?php

namespace Database\Seeders;

use App\Models\StatusEducations;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusEducationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'PHD'],
            ["name" => 'Ijazah Sarjana Muda'],
            ["name" => 'Diploma'],
            ["name" => 'Sijil'],
            ["name" => 'SPM'],
            ["name" => 'SRP'],
            ["name" => 'PMR'],
            ["name" => 'Tadika'],
            ["name" => 'IKM'],
            ["name" => 'SMA'],
            ["name" => 'Rendah'],
            ["name" => 'SMK'],
            ["name" => 'UPSR'],
            ["name" => 'Menengah'],
            ["name" => 'Form 2'],
            ["name" => 'Darjah 6'],
            ["name" => 'SKM'],
            ["name" => 'Tahfiz'],
            ["name" => 'STPM'],
            ["name" => 'Unimaps'],
            ["name" => 'IPTA'],
            ["name" => 'SMT'],
            ["name" => 'Pengajian Islam'],
            ["name" => 'Tingkatan 3']
        ];
        collect($arr)->each(fn ($a) => StatusEducations::create($a));
    }
}
