<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class PerarakanRequest extends FormRequest
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
			'name' => 'required|string|max:100',
			'visible' => 'nullable|boolean',
			'coords' => 'required|array|min:2',
			'coords.*' => 'array|size:2',
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
			'name.required' => 'Nama route diperlukan',
			'name.max' => 'Nama route tidak boleh melebihi 100 aksara',
			'coords.required' => 'Koordinat diperlukan',
			'coords.min' => 'Sekurang-kurangnya 2 titik koordinat diperlukan',
			'coords.*.size' => 'Setiap koordinat mesti mengandungi latitud dan longitud',
		];
	}
}
