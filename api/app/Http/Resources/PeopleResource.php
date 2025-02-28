<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PeopleResource extends JsonResource
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
			'nokp' => $this->nokp,
			'name' => strtoupper($this->name),
			'nickname' => $this->nickname,
			'mobile' => $this->mobile,
			'home' => $this->home,
			'gender' => $this->gender,
			'stsmenetap' => $this->stsmenetap,
			'nation' => $this->nation,
			'religion' => $this->religion,
			'edu_id' => $this->edu_id,
			'health_id' => $this->health_id,
			'cares_id' => $this->cares_id,
			'married_id' => $this->married_id,
			'stspencen' => $this->stspencen,
		];
	}
}
