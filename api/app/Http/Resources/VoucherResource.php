<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
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
			// 'dateTime' => $this->dateTime->format('d-m-Y h:i A'),
			'vdate' => $this->vdate->format('d-m-Y'),
			'vno' => $this->vno,
			'total' => $this->total,
			'name' => $this?->people?->name,
			'description' => $this->description,
			'details' =>  json_decode($this->details),
		];
	}
}
