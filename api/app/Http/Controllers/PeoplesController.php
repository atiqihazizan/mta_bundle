<?php

namespace App\Http\Controllers;

use App\Http\Requests\PeopleRequest;
use App\Http\Requests\KariahRequest;
use Illuminate\Http\Request;
use App\Models\Peoples;
use App\Models\StatusEducations;
use App\Models\StatusHealth;
use App\Models\StatusJob;
use App\Models\StatusMarriage;
use App\Models\StatusPenghuni;
use App\Models\StatusRelation;
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
		$job = StatusJob::all();
		$health = StatusHealth::all();
		$married = StatusMarriage::all();
		$education = StatusEducations::all();
		$sibling = StatusRelation::all();
    $status = StatusPenghuni::all();
		return response(compact('job','health','married','education','sibling','status'));
	}

	private function checkDuplicateNokp($nokp, $excludeId = null)
	{
		$query = Peoples::where('nokp', $nokp);
		if ($excludeId) {
			$query->where('id', '!=', $excludeId);
		}
		return $query->exists();
	}

	public function store(PeopleRequest $peopleRequest, KariahRequest $kariahRequest)
	{
		try {
			\DB::beginTransaction();

			// Validate and create records
			$peopleData = $peopleRequest->validated();

			// Semak duplicate nokp
			if ($this->checkDuplicateNokp($peopleData['nokp'])) {
				throw new \Exception('No. K/P ' . $peopleData['nokp'] . ' telah wujud dalam sistem');
			}

			$people = Peoples::create($peopleData);

			$kariahData = $kariahRequest->validated();
			$kariahData['ppl_id'] = $people->id;
			$kariah = $people->kariah()->create($kariahData);

			// Load relationships and transform data
			$kariah = $kariah->fresh(['sibling', 'sts', 'people.healthy', 'people.married', 'people.education', 'people.job']);
			
			$_arr = collect($kariah);
			$_ppl = $_arr['people'];
			$_hlt = $_arr['people']['healthy']['name'] ?? '';
			$_mrr = $_arr['people']['married']['name'] ?? '';
			$_edu = $_arr['people']['education']['name'] ?? '';
			$_job = $_arr['people']['job']['name'] ?? '';
			$_sib = $_arr['sibling']['name'] ?? '';

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
				'status' => $kariah->sts->name ?? ''
			]);

			unset($merge['healthy']);
			unset($merge['married']);
			unset($merge['education']);
			unset($merge['job']);

			\DB::commit();

			return response()->json([
				'success' => true,
				'message' => 'Data berjaya disimpan',
				'data' => $merge
			], 201);

		} catch (\Exception $e) {
			\DB::rollback();
			return response()->json([
				'success' => false,
				'message' => 'Ralat semasa menyimpan data: ' . $e->getMessage(),
				'errors' => [$e->getMessage()]
			], 500);
		}
	}

	public function getDetailWithReferences(Peoples $people)
	{
		// Load kariah relationship
		$people->load(['kariah' => function($query) {
			$query->with(['sibling', 'sts']);
		}]);

		// Get all reference data
		$job = StatusJob::all();
		$health = StatusHealth::all();
		$married = StatusMarriage::all();
		$education = StatusEducations::all();
		$sibling = StatusRelation::all();
		$status = StatusPenghuni::all();

		// Get kariah data if exists
		$kariah = $people->kariah->first();
		$kariahData = null;
		if ($kariah) {
			$kariahData = [
				'id' => $kariah->id,
				'addr_id' => $kariah->addr_id,
				'relation' => $kariah->relation,
				'status' => $kariah->status,
				'tanggungan' => $kariah->tanggungan,
				'penama' => $kariah->penama
			];
		}

		return response(compact('people', 'kariahData', 'job', 'health', 'married', 'education', 'sibling', 'status'));
	}

	public function update(PeopleRequest $request, KariahRequest $kariahRequest, Peoples $people)
	{
		try {
			\DB::beginTransaction();

			// Update people data
			$peopleData = $request->validated();

			// Semak duplicate nokp
			if ($this->checkDuplicateNokp($peopleData['nokp'], $people->id)) {
				throw new \Exception('No. K/P ' . $peopleData['nokp'] . ' telah wujud dalam sistem');
			}

			$people->update($peopleData);

			// Update kariah data
			if ($kariahRequest->has('addr_id')) {
				$kariahData = $kariahRequest->validated();
				$kariah = $people->kariah()->first();
				
				if ($kariah) {
					$kariah->update($kariahData);
				} else {
					$kariahData['ppl_id'] = $people->id;
					$kariah = $people->kariah()->create($kariahData);
				}

				// Load relationships and transform data
				$kariah = $kariah->fresh(['sibling', 'sts', 'people.healthy', 'people.married', 'people.education', 'people.job']);
				
				$_arr = collect($kariah);
				$_ppl = $_arr['people'];
				$_hlt = $_arr['people']['healthy']['name'] ?? '';
				$_mrr = $_arr['people']['married']['name'] ?? '';
				$_edu = $_arr['people']['education']['name'] ?? '';
				$_job = $_arr['people']['job']['name'] ?? '';
				$_sib = $_arr['sibling']['name'] ?? '';

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
					'status' => $kariah->sts->name ?? ''
				]);

				unset($merge['healthy']);
				unset($merge['married']);
				unset($merge['education']);
				unset($merge['job']);

				\DB::commit();

				return response()->json([
					'success' => true,
					'message' => 'Data berjaya dikemaskini',
					'data' => $merge
				]);
			}

			\DB::commit();
			return response()->json([
				'success' => true,
				'message' => 'Data berjaya dikemaskini',
				'data' => $people->fresh(['healthy', 'married', 'education', 'job'])
			]);

		} catch (\Exception $e) {
			\DB::rollback();
			return response()->json([
				'success' => false,
				'message' => 'Ralat semasa mengemaskini data: ' . $e->getMessage(),
				'errors' => [$e->getMessage()]
			], 500);
		}
	}

	public function destroy(Request $request, Peoples $people)
	{
		try {
			\DB::beginTransaction();

			// Semak jenis delete
			$deleteType = $request->query('deleteType', 'permanent');
			if (!in_array($deleteType, ['address', 'permanent'])) {
				throw new \Exception('Jenis delete tidak sah');
			}

			// Dapatkan rekod kariah
			$kariah = $people->kariah()->first();

			if ($deleteType === 'address') {
				// Semak jika kariah wujud
				if (!$kariah) {
					throw new \Exception('Rekod kariah tidak dijumpai');
				}

				// Semak jika sudah tiada alamat
				if (!$kariah->addr_id) {
					throw new \Exception('Rekod ini sudah tidak ada dalam alamat');
				}

				// Padam dari alamat sahaja
				$kariah->addr_id = null;
				$kariah->save();
				$message = 'Data berjaya dipadam dari alamat';
			} else {
				// Semak jika ada rekod yang bergantung
				// TODO: Tambah semakan untuk rekod yang bergantung jika perlu

				// Padam kekal (people & kariah)
				if ($kariah) {
					$kariah->delete();
				}
				$people->delete();
				$message = 'Data berjaya dipadam terus';
			}

			\DB::commit();

			return response()->json([
				'success' => true,
				'message' => $message
			]);

		} catch (\Exception $e) {
			\DB::rollback();
			return response()->json([
				'success' => false,
				'message' => 'Ralat semasa memadam data: ' . $e->getMessage(),
				'errors' => [$e->getMessage()]
			], 500);
		}
	}
}
