<?php

namespace Database\Seeders;

use App\Models\StatusRelation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StatusRelationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $arr = [
            ["name" => 'Suami/Bapa'],
            ["name" => 'Isteri/Ibu'],
            ["name" => 'Anak'],
            ["name" => 'Bapa'],
            ["name" => 'Ibu'],
            ["name" => 'Datuk'],
            ["name" => 'Nenek'],
            ["name" => 'Kakak'],
            ["name" => 'Abang'],
            ["name" => 'Adik'],
            ["name" => 'Sepupu'],
            ["name" => 'Mertua'],
            ["name" => 'Saudara'],
            ["name" => 'Ipar'],
            ["name" => 'Menantu'],
            ["name" => 'Cucu'],
            ["name" => 'Sendirian']
        ];
        collect($arr)->each(function ($a) {
            StatusRelation::create($a);
        });
    }
}
