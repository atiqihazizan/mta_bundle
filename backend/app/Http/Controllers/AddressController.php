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
		$totalKariah = Address::count();

		$gender = Peoples::selectRaw("gender, count(*) as total")
			->whereIn('gender', [1, 2])
			->groupBy('gender')
			->pluck('total', 'gender');

		$kesihatan = Peoples::join('status_healths', 'peoples.health_id', '=', 'status_healths.id')
			->selectRaw('status_healths.name as label, count(*) as total')
			->groupBy('status_healths.name')
			->pluck('total', 'label');

		$pekerjaan = Peoples::join('status_jobs', 'peoples.job_id', '=', 'status_jobs.id')
			->selectRaw('status_jobs.name as label, count(*) as total')
			->groupBy('status_jobs.name')
			->pluck('total', 'label');

		$pelajaran = Peoples::join('status_educations', 'peoples.edu_id', '=', 'status_educations.id')
			->selectRaw('status_educations.name as label, count(*) as total')
			->groupBy('status_educations.name')
			->pluck('total', 'label');

		$perkahwinan = Peoples::join('status_marriages', 'peoples.married_id', '=', 'status_marriages.id')
			->selectRaw('status_marriages.name as label, count(*) as total')
			->groupBy('status_marriages.name')
			->pluck('total', 'label');

		return response()->json([
			'status' => true,
			'data' => [
				'total_rumah'   => $totalRumah,
				'total_penduduk' => $totalPenduduk,
				'total_kariah'  => $totalKariah,
				'gender'        => [
					'Lelaki'    => $gender[1] ?? 0,
					'Perempuan' => $gender[2] ?? 0,
				],
				'kesihatan'     => $kesihatan,
				'pekerjaan'     => $pekerjaan,
				'pelajaran'     => $pelajaran,
				'perkahwinan'   => $perkahwinan,
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
