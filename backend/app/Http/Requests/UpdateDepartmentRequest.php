<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('department');
        return [
            'name' => ['required', 'string', 'max:255', "unique:departments,name,{$id}"],
            'description' => ['nullable', 'string', 'max:1000'],
        ];
    }
}


