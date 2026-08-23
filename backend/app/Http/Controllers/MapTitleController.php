<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MapTitle;

class MapTitleController extends Controller
{
	public function show()
	{
		return response()->json(['data' => MapTitle::current()]);
	}

	public function update(Request $request)
	{
		$data = $request->validate([
			'text'      => 'required|string|max:500',
			'x'         => 'required|numeric|min:0|max:100',
			'y'         => 'required|numeric|min:0|max:100',
			'font_size' => 'required|integer|min:8|max:72',
			'color'     => 'nullable|string|max:20',
			'bg_color'  => 'nullable|string|max:20',
			'visible'   => 'nullable|boolean',
		]);

		$title = MapTitle::current();
		$data['visible'] = $data['visible'] ?? true;
		$data['color'] = $data['color'] ?? '#1e293b';
		$data['bg_color'] = $data['bg_color'] ?? '#fbbf24';

		$title->update($data);

		return response()->json(['status' => true, 'data' => $title]);
	}
}