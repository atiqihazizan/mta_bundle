<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TabungResource extends JsonResource
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
			'dateTime' => $this->dateTime->format('d-m-Y'),
			'ttype' => $this->ttype,
			'strtype' => $this->TypeTabung(),
			'total' => number_format($this->total, 2),
			't100' => number_format($this->t100, 2),
			't50' => number_format($this->t50, 2),
			't20' => number_format($this->t20, 2),
			't10' => number_format($this->t10, 2),
			't5' => number_format($this->t5, 2),
			't1' => number_format($this->t1, 2),
			'remark' => $this->remark ?? '',
			'voucher' => $this->voucher ?? '',
		];
	}
}
