<?php

namespace App\Services;

use App\DTOs\UserDTO;
use App\Enums\UserRole;
use App\Models\User;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
        private readonly AuditService $auditService,
    ) {}

    public function register(array $data): User
    {
        $dto = UserDTO::fromRequest($data);
        $userData = $dto->toArray();
        $userData['role'] = UserRole::Intern->value;
        return $this->userRepository->create($userData);
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        $this->auditService->log('login', $user);

        return [
            'user' => $user->load('department'),
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $this->auditService->log('logout', $user);
        $user->currentAccessToken()->delete();
    }

    public function user(User $user): User
    {
        return $user->load('department', 'intern');
    }
}






