<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PerarakanResource extends JsonResource
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
			'name' => $this->name,
			'visible' => $this->visible,
			'coords' => $this->coords,
			'distance' => $this->distance,
			'distance_km' => $this->distance !== null ? number_format($this->distance / 1000, 2) : null,
		];
	}
}
