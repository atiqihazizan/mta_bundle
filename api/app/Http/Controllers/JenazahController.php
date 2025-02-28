<?php

namespace App\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use App\Http\Requests\JenazahRequest;
use App\Http\Resources\JenazahResource;
use App\Models\Jenazah;

class JenazahController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
		return JenazahResource::collection(
			Jenazah::orderBy('jdate', 'desc')->paginate(10)
		);
	}

	public function store(JenazahRequest $request)
	{
		$data = $request->validated();
		$res = Jenazah::create($data);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $res]));
	}

	public function show(Jenazah $jenazah)
	{
		$date = $jenazah->jdate->format('Y-m-d');
		$data = collect($jenazah);
		$data['jdate'] = $date;
		return $data;
	}

	public function update(JenazahRequest $request, Jenazah $jenazah)
	{
		$data = $request->validated();
		$jenazah->update($data);
		throw new HttpResponseException(response()->json(['status' => true]));
	}

	public function destroy(Jenazah $jenazah)
	{
		$jenazah->delete();
		return response()->json(['status' => true]);
	}

	public function report(Request $request)
	{
		$yrmth = $request->yrmth;
		return JenazahResource::collection(
			Jenazah::whereRaw('DATE_FORMAT(jdate,"%Y-%m") = ?', [$yrmth])
				->orderBy('jdate', 'desc')
				->get()
		);
	}
}
