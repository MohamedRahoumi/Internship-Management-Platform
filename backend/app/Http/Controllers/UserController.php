<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateUserRequest;
use App\Http\Resources\UserResource;
use App\Mail\NewUserAccount;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function __construct(
        private readonly UserRepositoryInterface $userRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $users = $this->userRepository->paginate($request->only(['role', 'department_id', 'search']));

        return response()->json(UserResource::collection($users));
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $data = $request->validated();

        $plainPassword = $data['password'] ?? Str::random(12);
        $data['password'] = bcrypt($plainPassword);

        $user = $this->userRepository->create($data);

        Mail::to($user->email)->send(new NewUserAccount($user, $plainPassword));

        return response()->json(new UserResource($user), 201);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        return response()->json(new UserResource($user));
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $data = $request->validate([
            'nom' => ['sometimes', 'string', 'max:255'],
            'prenom' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', "unique:users,email,{$id}"],
            'role' => ['sometimes', 'string', 'in:administrator,rh,supervisor,intern'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user = $this->userRepository->update($user, $data);

        return response()->json(new UserResource($user));
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userRepository->findById($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $this->userRepository->delete($user);

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    public function rhUsers(): JsonResponse
    {
        $users = $this->userRepository->findByRole('rh');

        return response()->json(UserResource::collection($users));
    }

    public function supervisors(): JsonResponse
    {
        $users = $this->userRepository->findByRole('supervisor');

        return response()->json(UserResource::collection($users));
    }
}
