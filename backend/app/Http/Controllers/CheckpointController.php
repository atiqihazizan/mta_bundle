<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Checkpoint;

class CheckpointController extends Controller
{
	public function index()
	{
		return response()->json(['data' => Checkpoint::orderBy('id')->get()]);
	}

	public function store(Request $request)
	{
		$data = $request->validate([
			'name'        => 'required|string|max:255',
			'label'       => 'nullable|string|max:255',
			'label_color' => 'nullable|string|max:20',
			'icon'        => 'nullable|string|max:50',
			'lat'         => 'required|numeric',
			'lng'         => 'required|numeric',
			'route_id'    => 'nullable|integer|exists:perarakans,id',
			'visible'     => 'nullable|boolean',
		]);

		$data['visible'] = $data['visible'] ?? true;
		$data['icon'] = $data['icon'] ?? 'pin';
		$data['label_color'] = $data['label_color'] ?? '#ffffff';

		return response()->json(['status' => true, 'data' => Checkpoint::create($data)], 201);
	}

	public function update(Request $request, Checkpoint $checkpoint)
	{
		$data = $request->validate([
			'name'        => 'required|string|max:255',
			'label'       => 'nullable|string|max:255',
			'label_color' => 'nullable|string|max:20',
			'icon'        => 'nullable|string|max:50',
			'lat'         => 'required|numeric',
			'lng'         => 'required|numeric',
			'route_id'    => 'nullable|integer|exists:perarakans,id',
			'visible'     => 'nullable|boolean',
		]);

		$checkpoint->update($data);

		return response()->json(['status' => true, 'data' => $checkpoint]);
	}

	public function destroy(Checkpoint $checkpoint)
	{
		$checkpoint->delete();

		return response()->json(['status' => true]);
	}
}