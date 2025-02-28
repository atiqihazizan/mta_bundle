<?php

namespace App\Http\Controllers;

use App\Http\Requests\PeopleRequest;
use Illuminate\Http\Request;
use App\Models\Peoples;
use App\Models\StatusEducations;
use App\Models\StatusHealth;
use App\Models\StatusJob;
use App\Models\StatusMarriage;
use Illuminate\Http\Exceptions\HttpResponseException;

class PeoplesController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
	}

	public function getAll(){
		return Peoples::all(['id','name']);
	}

	public function create()
	{
		//
	}

	public function store(PeopleRequest $request)
	{
		//
	}

	public function show(Peoples $people)
	{
		$job = StatusJob::all();
		$health = StatusHealth::all();
		$married = StatusMarriage::all();
		$education = StatusEducations::all();
		// $people = $_pre->withoutRelations();

	return response(compact('people','job','health','married','education'));
	}

	public function update(PeopleRequest $request, Peoples $people)
	{
		$data = $request->validated();
		$people->update($data);
		throw new HttpResponseException(response()->json(['status' => true, 'data' => $people]));
	}

	public function destroy(Peoples $peoples)
	{
		//
	}
}
