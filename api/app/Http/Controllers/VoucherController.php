<?php

namespace App\Http\Controllers;

use App\Http\Requests\VoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Business;
use App\Models\Voucher;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
		return VoucherResource::collection(
			Voucher::with('people')->orderBy('vdate', 'desc')->paginate(10)
		);
	}
	public function listPeople(Request $request)
	{
		$user = $request->user();
		return Business::get(['id','name']);
	}

	public function create()
	{
		//
	}

	public function store(VoucherRequest $request)
	{
		$user = $request->user();
		$data = $request->validated();
		$voucher = Voucher::create($data);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $voucher]));
	}

	public function show(Voucher $voucher)
	{
		$date = $voucher->vdate->format('Y-m-d');
		$data = collect($voucher);
		$data['vdate'] = $date;
		return $data;
	}

	public function update(VoucherRequest $request, Voucher $voucher)
	{
		$user = $request->user();
		$data = $request->validated();
		$voucher->update($data);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $voucher]));
	}

	public function destroy(Voucher $voucher)
	{
		$voucher->delete();
		return response()->json(['status' => true]);
	}
}
