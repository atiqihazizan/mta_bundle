<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use App\Models\Areas;
use App\Models\StatusCares;
use App\Models\Kariah;
use App\Models\Peoples;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddressController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
		return AddressResource::collection(Address::with('orang')->paginate(10));
		// return AddressResource::collection(Address::with('orang')->get());
	}

	public function dashboardStats()
	{
		$totalRumah = Address::count();
		$totalPenduduk = Peoples::count();

		return response()->json([
			'status' => true,
			'data' => [
				'total_rumah' => $totalRumah,
				'total_penduduk' => $totalPenduduk
			]
		]);
	}

	public function create()
	{
		//
	}

	public function store(AddressRequest $request)
	{
		$data = $request->validated();
		$addr = Address::create($data);
		$addr->kawasan = $addr->area?->aname;
		unset($addr->area);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $addr]));
	}

	public function show(Address $address)
	{
		//
	}

	public function edit(Address $address)
	{
		//
	}

	public function update(AddressRequest $request, Address $address)
	{
		$data = $request->validated();
		$address->update($data);
		$addr = $address;
		$addr->kawasan = $addr->area?->aname;
		unset($addr->area);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $addr]));
	}

	public function destroy(Address $address)
	{
		//
	}

	public function options()
	{
		$areas = Areas::all();
		$cares = StatusCares::all();
		return response()->json(compact('areas','cares'));
	}
}
