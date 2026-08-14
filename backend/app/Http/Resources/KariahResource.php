<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KariahResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return parent::toArray($request);
		// return [
		// 	'id' => $this->id,
		// 	'addr_id' => $this->addr_id,
		// 	'ppl_id' => $this->ppl_id,
		// 	// 'relation' => $this->relation,
		// 	// 'status' => $this->status,
		// 	'tanggungan' => $this->tanggungan,
		// 	'solatjemaah' => $this->solatjemaah,
		// 	'penama' => $this->penama,
		// 	// 'details' => json_decode($this->info),
		// 	// 'details' => new PeopleResource($this->info)
		// 	// 'relation' => $this->slib,
		// 	// 'status' => $this->sts_diri,
		// 	// 'nokp' => $this->nokp,
		// 	// 'name' => $this->name,
		// 	// 'nickname' => $this->nickname,
		// 	// 'mobile' => $this->mobile,
		// 	// 'home' => $this->home,
		// 	// 'stspencen' => $this->stspencen,
		// 	// 'penyakit' => $this->penyakit,
		// 	// 'kesihatan' => $this->kesihatan,
		// 	// 'perkahwinan' => $this->perkahwinan,
		// 	// 'pelajaran' => $this->pelajaran,
		// ];
	}
}
