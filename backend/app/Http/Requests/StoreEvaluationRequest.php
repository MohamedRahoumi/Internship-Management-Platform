<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'competences_techniques' => ['required', 'integer', 'min:0', 'max:100'],
            'communication' => ['required', 'integer', 'min:0', 'max:100'],
            'discipline' => ['required', 'integer', 'min:0', 'max:100'],
            'autonomie' => ['required', 'integer', 'min:0', 'max:100'],
            'travail_equipe' => ['required', 'integer', 'min:0', 'max:100'],
            'qualite_rapport' => ['required', 'integer', 'min:0', 'max:100'],
            'commentaire_general' => ['nullable', 'string', 'max:2000'],
            'recommandation' => ['nullable', 'string', 'max:255'],
        ];
    }
}


