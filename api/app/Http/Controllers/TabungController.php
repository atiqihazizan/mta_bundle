<?php

namespace App\Http\Controllers;

use App\Http\Requests\TabungRequest;
use App\Http\Resources\TabungApiResource;
use App\Http\Resources\TabungResource;
use App\Models\Tabung;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class TabungController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();

		return TabungResource::collection(
			Tabung::orderBy('dateTime', 'desc')->orderBy('ttype', 'desc')->paginate(10)
		);
	}

	public function funds(Request $request)
	{
		$user = $request->user();

		return TabungApiResource::collection(
			Tabung::orderBy('dateTime', 'desc')->orderBy('ttype', 'desc')->get()
		);
	}

	public function store(TabungRequest $request)
	{
		$data = $request->validated();
		$tabung = Tabung::create($data);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $tabung]));
	}

	public function show(Tabung $kutipan, Request $request)
	{
		// 	throw new HttpResponseException(response()->json([
		// 		'status' => false,
		// 		'errors'  => $kutipan
		//   ]));
		//  $user = $request->user();
		//  if ($user->id !== $kutipan->user_id) {
		// 	  return abort(403, 'Unauthorized action');
		//  }
		$date = $kutipan->dateTime->format('Y-m-d');
		$data = collect($kutipan);
		$data['dateTime'] = $date;
		return $data;
	}

	public function update(TabungRequest $request, Tabung $kutipan)
	{
		$data = $request->validated();
		$kutipan->update($data);
		throw new HttpResponseException(response()->json(['status' => true]));
	}

	public function destroy(Tabung $kutipan)
	{
		$kutipan->delete();
		return response()->json(['status' => true]);
	}

	public function nvchr()
	{
		$first = Tabung::orderBy('voucher', 'desc')->first();
		return $first->voucher;
	}
}
