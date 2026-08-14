<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		// return parent::toArray($request);
		return [
			'id' => $this->id,
			// 'area_id' => $this->area_id,
			'status_rumah_id' => $this->status_rumah_id,
			'cares_id' => $this->cares_id,
			// 'head_id' => $this->head_id,
			'khairat' => $this->khairat,
			'addr' => $this->addr,
			'addr2' => $this->addr2,
			'addr3' => $this->addr3,
			'address' => "$this->addr, $this->addr2, $this->addr3",
			'area' => $this->area_id > 0 ? strtoupper($this->area->aname) : '',
			'ketua' => $this->head_id > 0 ? $this->ketua : '',
			'bilangan' => collect($this->orang)->count(),
			// 'orang' => KariahResource::collection($this->orang)
		];
	}
}
