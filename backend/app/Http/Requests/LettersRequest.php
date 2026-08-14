<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Foundation\Http\FormRequest;

class LettersRequest extends FormRequest
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
			'rcvd_at' => 'required|date',
			'ltdate' => 'required|date',
			'ltdesc' => 'required',
			'lfrom' => 'required|string',
			'ltdue' => 'string|nullable',
			'chairman_act' => 'nullable',
			'biro_act' => 'nullable',
			'remark' => 'nullable',
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
			'rcvd_at.required' => 'Tarikh terima diperlukan',
			'rcvd_at.date' => 'Tarikh tidak betul',
			'ltdue.required' => 'Tarikh akhir diperlukan',
			'ltdue.date' => 'Tarikh akhir tidak betul',
			'ltdate.required' => 'Tarikh surat diperlukan',
			'ltdate.date' => 'Tarikh surat tidak betul',
			'ltdesc.required' => 'Penerangan diperlukan',
			'lfrom.required' => 'Butiran penghantar diperlukan',
		];
	}
}
