<?php

namespace App\DTOs;

class UserDTO
{
    public function __construct(
        public readonly string $cin,
        public readonly string $civility,
        public readonly string $nom,
        public readonly string $prenom,
        public readonly string $telephone,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $photo = null,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            cin: $data['cin'],
            civility: $data['civility'],
            nom: $data['nom'],
            prenom: $data['prenom'],
            telephone: $data['telephone'],
            email: $data['email'],
            password: $data['password'],
            photo: $data['photo'] ?? null,
        );
    }

    public function toArray(): array
    {
        return [
            'cin' => $this->cin,
            'civility' => $this->civility,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'telephone' => $this->telephone,
            'email' => $this->email,
            'password' => bcrypt($this->password),
            'photo' => $this->photo,
        ];
    }
}


