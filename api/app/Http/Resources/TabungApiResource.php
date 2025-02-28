<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TabungApiResource extends JsonResource
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
			'ttype' => $this->ttype ?? 0,
			'strtype' => $this->TypeTabung(),
			'total' => $this->total ?? 0,
			't100' => $this->t100 ?? 0,
			't50' => $this->t50 ?? 0,
			't20' => $this->t20 ?? 0,
			't10' => $this->t10 ?? 0,
			't5' => $this->t5 ?? 0,
			't1' => $this->t1 ?? 0,
			'others' => $this->ohters ?? '',
			'remark' => $this->remark ?? '',
			'voucher' => $this->voucher ?? '',
		];
    }
}
