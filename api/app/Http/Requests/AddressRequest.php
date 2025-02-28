<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddressRequest extends FormRequest
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
			'addr' => 'required',
			'addr2' => 'required',
			'addr3' => 'required',
			'poskod' => 'required',
			'area_id' => 'required',
			'cares_id'=>'required',
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
			'addr.required' => 'No rumah diperlukan',
			'addr2.required' => 'Jalan diperlukan',
			'addr3.required' => 'Lorong diperlukan',
			'poskod.required' => 'poskod diperlukan',
			'area_id.required' => 'Kawasan diperlukan',
			'cares_id.required' => 'Pernah terima bantuan diperlukan',
		];
	}
}
