<?php

namespace App\Http\Controllers;

use App\Http\Requests\KariahRequest;
use Illuminate\Http\Request;
use App\Http\Resources\KariahResource;
use App\Models\Address;
use App\Models\Kariah;
use App\Models\StatusEducations;
use App\Models\StatusHealth;
use App\Models\StatusJob;
use App\Models\StatusMarriage;
use App\Models\StatusPenghuni;
use App\Models\StatusRelation;
use Illuminate\Http\Exceptions\HttpResponseException;

class KariahController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
		return $this->queryResidents($request, 10);
	}

	public function residents(Request $request)
	{
		return $this->queryResidents($request);
	}

	public function create()
	{
		//
	}

	public function store(KariahRequest $request)
	{
		//
	}

	public function show(Address $address)
	{
		$addr = $address;
		$addr->kawasan = $addr->area?->aname;
		unset($addr->area);
		$_kar = Kariah::with('address', 'sibling', 'sts', 'people')->where('addr_id', $addr->id)->get();

		$peops = [];
		for ($i = 0; $i < $_kar->count(); $i++) {
			$_arr = collect($_kar[$i]);
			$_ppl = $_arr['people'];
			$_hlt = $_arr['people']['healthy']['name'] ?? '';
			$_mrr = $_arr['people']['married']['name'] ?? '';
			$_edu = $_arr['people']['education']['name'] ?? '';
			$_job = $_arr['people']['job']['name'] ?? '';
			$_sib = $_arr['sibling']['name']??'';
			unset($_arr['address']);
			unset($_arr['people']);
			unset($_arr['sibling']);
			unset($_arr['sts']);
			unset($_ppl['id']);
			$merge = $_arr->merge([
				...$_ppl,
				'healty' => $_hlt,
				'selfstatus' => $_mrr,
				'edustatus' => $_edu,
				'employee' => $_job,
				'sibling' => $_sib,
			]);
			unset($merge['healthy']);
			unset($merge['married']);
			unset($merge['education']);
			unset($merge['job']);
			$peops[] = $merge;
		}
		return KariahResource::collection(['address'=>$addr,'people'=>$peops]);
	}

	public function edit(Kariah $kariah)
	{
		//
	}

	public function update(KariahRequest $request, Kariah $kariah)
	{
		$data = $request->validated();
		$kariah->update($data);

		//test
		$addrId = $kariah->addr_id;
		$_kar = Kariah::with('address', 'sibling', 'sts', 'people')->where('addr_id', $addrId)->get();

		$peops = [];
		for ($i = 0; $i < $_kar->count(); $i++) {
			$_arr = collect($_kar[$i]);
			$_ppl = $_arr['people'];
			$_hlt = $_arr['people']['healthy']['name'] ?? '';
			$_mrr = $_arr['people']['married']['name'] ?? '';
			$_edu = $_arr['people']['education']['name'] ?? '';
			$_job = $_arr['people']['job']['name'] ?? '';
			$_sib = $_arr['sibling']['name']??'';
			unset($_arr['address']);
			unset($_arr['people']);
			unset($_arr['sibling']);
			unset($_arr['sts']);
			unset($_ppl['id']);
			$merge = $_arr->merge([
				...$_ppl,
				'healty' => $_hlt,
				'selfstatus' => $_mrr,
				'edustatus' => $_edu,
				'employee' => $_job,
				'sibling' => $_sib,
			]);
			unset($merge['healthy']);
			unset($merge['married']);
			unset($merge['education']);
			unset($merge['job']);
			$peops[] = $merge;
		}
		//
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $peops]));
	}

	public function destroy(Kariah $kariah)
	{
		//
	}
	public function people(Kariah $kariah)
	{
		$relation = StatusRelation::all();
		$status = StatusPenghuni::all();
		$self = $kariah->withoutRelations();
		return response(compact('self', 'relation', 'status'));
	}

	public function queryResidents($request, $paginate = 0)
	{
		// $user = $request->user();
		$query = Kariah::query();
		if ($paginate == 0) $paginate = $query->count();
		// $query->with('sibling', 'sts', 'people', 'people.healthy', 'people.married', 'people.education', 'people.job');
		if ($request->name) $query->whereHas('people', function ($query2) use ($request) {
			$query2->where('name', 'LIKE',
				"%$request->name%"
			);
		});

		$kariahs = $query->paginate($paginate);
		$result = tap($kariahs, function ($paginatedInstance) {
			return $paginatedInstance->getCollection()->transform(function ($value) {
				$_ppl = $value->people;
				$value->nokp = $_ppl->nokp;
				$value->name = $_ppl->name;
				$value->nickname = $_ppl->nickname;
				$value->mobile = $_ppl->mobile;
				$value->home = $_ppl->home;
				$value->stspencen = $_ppl->stspencen;
				$value->gender = $_ppl->gender == 1 ? 'Lelaki' : 'Perempuan';
				$value->penyakit = $_ppl->penyakit;
				$value->kesihatan = $_ppl->healthy?->name;
				$value->perkahwinan = $_ppl->married?->name;
				$value->pelajaran = $_ppl->education?->name;
				$value->pekerjaan = $_ppl->job?->name;
				$value->relation = $value->sibling?->name;
				$value->status = $value->sts?->name;
				unset($value->people);
				unset($value->sibling);
				unset($value->sts);

				return $value;
			});
		});

		return KariahResource::collection($result);
	}
}
