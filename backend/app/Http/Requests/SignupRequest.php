<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class SignupRequest extends FormRequest
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
			'name' => 'required|string',
			'username' => 'required|string|unique:users,username',
			// 'email'=>'required|email|string|unique:users,email',
			'password' => [
				'required',
				// 'confirmed',
				Password::min(8)->mixedCase()->numbers(),
				// Password::min(8)->mixedCase()->numbers()->symbols(),
			],
			'password_confirmation' => 'required|same:password'
		];
	}
	public function messages(): array
	{
		return [
			'name.required' => 'Nama penuh diperlukan',
			'username.required' => 'Nama pengguna diperlukan',
			'username.unique' => 'Nama pengguna sudah diambil',
			'password.required' => 'Katalaluan diperlukan',
			'password.min' => "Katalaluan tidak boleh kurang dari 8 aksara\n",
			'password.mixed' => "Katalaluan hendaklah mengandungi huruf besar dan kecil\n",
			'password.numbers' => "Katalaluan hendaklah mengandungi nombor\n",
			// 'password.mix' => 'Password hendak'  mempunyai sekurangnya 8 karekter dan 1 uppercase dan 1 simbol dan 1 number',
			'password_confirmation.same' => 'Ulangan tidak sepadan dengan katalalun'
		];
	}
}
