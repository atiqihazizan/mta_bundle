<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class KariahRequest extends FormRequest
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
			'addr_id' => 'required',
			'status' => 'required',
			'relation' => 'required',
			'tanggungan'  => 'nullable',
			'penama' => 'nullable'
		];
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
			'status.required' => 'Status diperlukan',
			'relation.required' => 'Hubungan diperlukan',
      'addr_id.required' => 'Alamat diperlukan',
		];
	}
}
