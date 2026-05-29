<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class MondayDate implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $timestamp = strtotime((string) $value);
        if ($timestamp === false) {
            $fail('La date est invalide.');
            return;
        }

        if ((int) date('N', $timestamp) !== 1) {
            $fail('La date de début doit être un lundi.');
        }
    }
}


