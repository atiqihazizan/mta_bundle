<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class VoucherRequest extends FormRequest
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
		$rules = [
			'vdate' => 'date',
			'total' => 'numeric',
			'bis_id' => 'numeric',
			'description' => 'required',
			'details' => 'required|json',
			'vno' => 'nullable',
		];

		if ($this->getMethod() == "POST") {
			$rules += [
				'created_by' => 'required|numeric',
		// 		'barcode' => 'required|numeric|unique:inventories,barcode',
			];
		}

		if ($this->getMethod() == "PUT") {
		// 	$inv = $this->route('inventory');
			$rules += [
				'updated_by' => 'required|numeric',
		// 		'barcode' => [
		// 			'required',
		// 			'numeric',
		// 			// Rule::unique(Inventory::class)->ignore($this->inventory)
		// 			Rule::unique(Inventory::class)->ignore($inv->id)
		// 		],
			];
		}

		return $rules;
	}

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
			'vdate.required' => 'Tarikh diperlukan',
			'vdate.date' => 'Tarikh tidak betul',
			'total.numeric' =>'Jumlah diperlukan',
			'bis_id.numeric' =>'Bayaran kepada diperlukan',
			'description.required' => 'Bayaran untuk diperlukan',
			'created_by.required' => 'Sila login semula',
			'created_by.numeric' => 'Sila login semula',
			'updated_by.required' => 'Sila login semula',
			'updated_by.numeric' => 'Sila login semula',
		];
	}
}
