<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class JenazahRequest extends FormRequest
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
			'jdate' => 'required',
			'people_id' => 'nullable',
			'lorong' => 'required|numeric|min:1',
			'lubang' => 'required|numeric|min:1',
			'cost' => 'required|numeric|min:0',
			'type' => 'required|numeric|min:1',
			'alamat' => 'required|nullable',
			'name' => 'required|nullable',
		];

		if ($this->getMethod() == "POST") {
			$rules += [
				'created_by' => 'required|numeric',
				'updated_by' => 'nullable',
		// 		'barcode' => 'required|numeric|unique:inventories,barcode',
			];
		}

		if ($this->getMethod() == "PUT") {
		// 	$inv = $this->route('inventory');
			$rules += [
				'updated_by' => 'required|numeric',
				'created_by' => 'nullable',
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
			'jdate.required' => 'Tarikh tidak betul',
			'jdate.date' => 'Tarikh tidak betul',
			// 'people_id.numeric' => 'Jumlah terkumpul tidak betul',
			'lorong.numeric' => 'No lorong hendaklah dalam nombor',
			'lubang.numeric' => 'No lubang hendaklah dalam nombor',
			'cost.numeric' => 'Jumlah belanja hedaklah dalam nombor',
			'cost.required' => 'Jumlah belanja diperlukan',
			'type.numeric' => 'Jenis pengurusan hendaklah dipilih',
		];
	}
}
