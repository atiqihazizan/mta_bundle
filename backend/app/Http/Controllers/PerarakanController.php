<?php

namespace App\Http\Controllers;

use App\Http\Requests\PerarakanRequest;
use App\Http\Resources\PerarakanResource;
use App\Models\Perarakan;

class PerarakanController extends Controller
{
	public function index()
	{
		return PerarakanResource::collection(Perarakan::all());
	}

	public function store(PerarakanRequest $request)
	{
		$data = $request->validated();
		$data['visible'] = $data['visible'] ?? true;
		$data['distance'] = $this->calculateDistance($data['coords']);

		$perarakan = Perarakan::create($data);

		return new PerarakanResource($perarakan);
	}

	public function show(Perarakan $perarakan)
	{
		return new PerarakanResource($perarakan);
	}

	public function update(PerarakanRequest $request, Perarakan $perarakan)
	{
		$data = $request->validated();
		$data['visible'] = $data['visible'] ?? $perarakan->visible;
		$data['distance'] = $this->calculateDistance($data['coords']);

		$perarakan->update($data);

		return new PerarakanResource($perarakan);
	}

	public function destroy(Perarakan $perarakan)
	{
		$perarakan->delete();

		return response()->json(['status' => true, 'message' => 'Route perarakan dipadam']);
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
			$d = $R * $c;

			$total += $d;
		}

		return round($total, 2);
	}
}