<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class TabungRequest extends FormRequest
{
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool
	{
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array
	{
		return [
			'dateTime' => 'date',
			'ttype' => 'numeric',
			'total' => 'numeric',
			'voucher' => 'required',
			't100' => 'nullable|numeric',
			't50' => 'nullable|numeric',
			't20' => 'nullable|numeric',
			't10' => 'nullable|numeric',
			't5' => 'nullable|numeric',
			't1' => 'nullable|numeric',
			'remark' => 'nullable',
			'others' => 'nullable',
		];

		// if ($this->getMethod() == "POST") {
		// 	$rules += [
		// 		'barcode' => 'required|numeric|unique:inventories,barcode',
		// 	];
		// }

		// if ($this->getMethod() == "PUT") {
		// 	$inv = $this->route('inventory');
		// 	$rules += [
		// 		'barcode' => [
		// 			'required',
		// 			'numeric',
		// 			// Rule::unique(Inventory::class)->ignore($this->inventory)
		// 			Rule::unique(Inventory::class)->ignore($inv->id)
		// 		],
		// 	];
		// }

		// return $rules;
	}
	// protected function failedValidation(Validator $validator): void
	// {
	// 	$this->validateRequest($validator);
	// }
	public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'errors'  => $validator->errors()
        ]));
    }

	public function messages(): array
	{
		return [
			'dateTime.required' => 'Tarikh tidak betul',
			'dateTime.date' => 'Tarikh tidak betul',
			'total.numeric' =>'Jumlah terkumpul tidak betul',
			'ttype.numeric' =>'Jenis tabung diperlukan',
			'voucher.required' =>'Rujukan diperlukan',
			't100.numeric' =>'Amaunt RM10 hendaklah dalam nombor',
			't50.numeric' =>'Amaunt RM50 hendaklah dalam nombor',
			't20.numeric' =>'Amaunt RM20 hendaklah dalam nombor',
			't10.numeric' =>'Amaunt RM10 hendaklah dalam nombor',
			't5.numeric' =>'Amaunt RM5 hendaklah dalam nombor',
			't1.numeric' =>'Amaunt RM1 hendaklah dalam nombor',
		];
	}
}
