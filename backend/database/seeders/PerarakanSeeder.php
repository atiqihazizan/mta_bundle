<?php

namespace Database\Seeders;

use App\Models\Perarakan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PerarakanSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 */
	public function run(): void
	{
		$path = base_path('../perarakan.json');
		if (!file_exists($path)) {
			$path = base_path('perarakan.json');
		}

		if (!file_exists($path)) {
			$this->command->error('perarakan.json tidak dijumpai');
			return;
		}

		$raw = file_get_contents($path);
		$raw = trim($raw);
		// Normalise JS object literal ke JSON yang sah
		$raw = preg_replace('/,(\s*[\]}])/', '$1', $raw); // buang trailing comma
		$raw = preg_replace('/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/', '$1"$2":', $raw); // quote kunci
		$raw = rtrim($raw, ',');

		$data = json_decode($raw, true);

		if (!is_array($data)) {
			$this->command->error('Gagal parse perarakan.json');
			return;
		}

		$items = isset($data['coords']) ? [$data] : $data;

		foreach ($items as $item) {
			$coords = $item['coords'] ?? [];
			if (count($coords) < 2) {
				continue;
			}

			Perarakan::create([
				'name' => $item['name'] ?? 'Route Perarakan',
				'visible' => $item['visible'] ?? true,
				'coords' => $coords,
				'distance' => $this->calculateDistance($coords),
			]);
		}
	}

	private function calculateDistance(array $coords): float
	{
		$R = 6371000;
		$total = 0.0;
		$count = count($coords);

		for ($i = 0; $i < $count - 1; $i++) {
			[$lat1, $lng1] = $coords[$i];
			[$lat2, $lng2] = $coords[$i + 1];

			$dLat = deg2rad($lat2 - $lat1);
			$dLng = deg2rad($lng2 - $lng1);

			$a = sin($dLat / 2) ** 2
				+ cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLng / 2) ** 2;
			$c = 2 * atan2(sqrt($a), sqrt(1 - $a));

			$total += $R * $c;
		}

		return round($total, 2);
	}
}
