<?php

namespace App\Http\Controllers;

use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use App\Http\Requests\LettersRequest;
use App\Http\Resources\LettersResource;
use App\Models\Letters;

class LettersController extends Controller
{
	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request)
	{
		$user = $request->user();
		return LettersResource::collection(Letters::orderBy('ltdate', 'desc')->paginate(10));
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(LettersRequest $request)
	{
		$req = $request->validated();
		$data = Letters::create($req);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $data]));
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Letters $letter)
	{
		// $date = $letters->dateTime->format('Y-m-d');
		// $data = collect($letters);
		// $data['dateTime'] = $date;
		// return new LettersResource($letter);
		$data = collect($letter);
		$data['rcvd_at'] = $letter->rcvd_at->format('Y-m-d');
		$data['ltdate'] = $letter->ltdate->format('Y-m-d');
		$data['ltdue'] = $letter->ltdue ? $letter->ltdue->format('Y-m-d') : '';
		return $data;
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(LettersRequest $request, Letters $letter)
	{
		$data = $request->validated();
		$letter->update($data);
		throw new HttpResponseException(response()->json(['status' => true]));
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Letters $letter)
	{
		$letter->delete();
		return response()->json(['status' => true]);
	}
}
