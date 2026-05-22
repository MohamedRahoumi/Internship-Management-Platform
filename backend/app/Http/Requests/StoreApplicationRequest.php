<?php

namespace App\Http\Requests;

use App\Rules\MondayDate;
use App\Rules\ValidDurationForCycle;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cin' => ['required', 'string', 'max:20', Rule::unique('users', 'cin')->ignore($this->user()->id)],
            'civility' => ['required', 'string', 'in:Monsieur,Madame,Mademoiselle'],
            'nom' => ['required', 'string', 'max:255'],
            'prenom' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($this->user()->id)],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],

            'cycle_formation' => ['required', 'string', 'max:255'],
            'niveau_etude' => ['required', 'string', 'max:255'],
            'ville_etablissement' => ['required', 'string', 'max:255'],
            'type_etablissement' => ['required', 'string', 'in:Public,Privé'],
            'nom_complet_etablissement' => ['required', 'string', 'max:255'],
            'specialite' => ['required', 'string', 'max:255'],

            'date_debut' => ['required', 'date', 'after:today', new MondayDate],
            'date_fin' => ['required', 'date', 'after:date_debut'],
            'duree' => ['required', 'integer', 'min:1', new ValidDurationForCycle(
                $this->input('cycle_formation', ''),
                $this->input('niveau_etude', ''),
            )],

            'whatsapp_confirmed' => ['accepted'],
            'dossier_envoye' => ['accepted'],
            'conditions_acceptees' => ['accepted'],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('nom')) {
            $this->merge(['nom' => mb_strtoupper($this->input('nom'), 'UTF-8')]);
        }
    }

    public function messages(): array
    {
        return [
            'cin.unique' => 'Ce CIN est déjà utilisé.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'date_debut.after' => 'La date de début doit être ultérieure à aujourd\'hui.',
            'date_fin.after' => 'La date de fin doit être ultérieure à la date de début.',
            'photo.image' => 'Le fichier doit être une image.',
            'photo.mimes' => 'La photo doit être au format JPG, JPEG ou PNG.',
            'photo.max' => 'La photo ne doit pas dépasser 2 Mo.',
            'whatsapp_confirmed.accepted' => 'Vous devez confirmer votre adhésion au groupe WhatsApp.',
            'dossier_envoye.accepted' => 'Vous devez confirmer l\'envoi du dossier papier.',
            'conditions_acceptees.accepted' => 'Vous devez accepter les conditions.',
        ];
    }
}




