<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JenazahResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @return array<string, mixed>
	 */
	public function toArray(Request $request): array
	{
		return [
			'id' => $this->id,
			'jdate' => $this->jdate->format('d-m-Y'),
			// 'people_id' => (int) $this->people_id,
			'lorong' => (int) $this->lorong,
			'lubang' => (int) $this->lubang,
			'cost' => number_format($this->cost, 2),
			'type' => $this->pengurusan(),
			'typId' => $this->type,
			'alamat' => $this->alamat,
			'name' => $this->name,
		];
	}
}
