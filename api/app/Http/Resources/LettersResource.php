<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LettersResource extends JsonResource
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
					'rcvd_at' => $this->rcvd_at->format('d-m-Y'),
					'ltdate' => $this->ltdate->format('d-m-Y'),
					'ltdue' => $this->ltdue?->format('d-m-Y') ?? '',
					'ltdesc' => $this->ltdesc,
					'lfrom' => $this->lfrom,
					'chairman_act' => $this->chairman_act,
					'biro_act' => $this->biro_act,
					'remark' => $this->remark,
				];
    }
}
