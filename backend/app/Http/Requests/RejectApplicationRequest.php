<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RejectApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'motif_refus' => ['required', 'string', 'min:10'],
        ];
    }

    public function messages(): array
    {
        return [
            'motif_refus.min' => 'Le motif de refus doit contenir au moins 10 caractères.',
        ];
    }
}


