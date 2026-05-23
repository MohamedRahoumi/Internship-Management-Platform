<?php

namespace App\Services;

use App\DTOs\ApplicationDTO;
use App\Enums\ApplicationStatus;
use App\Enums\InternStatus;
use App\Models\InternshipApplication;
use App\Models\User;
use App\Repositories\Interfaces\ApplicationRepositoryInterface;
use App\Repositories\Interfaces\InternRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Support\Str;

class ApplicationService
{
    public function __construct(
        private readonly ApplicationRepositoryInterface $applicationRepository,
        private readonly InternRepositoryInterface $internRepository,
        private readonly UserRepositoryInterface $userRepository,
        private readonly AuditService $auditService,
    ) {}

    public function create(User $user, array $data): InternshipApplication
    {
        $this->userRepository->update($user, [
            'cin' => $data['cin'] ?? $user->cin,
            'civility' => $data['civility'] ?? $user->civility,
            'nom' => $data['nom'] ?? $user->nom,
            'prenom' => $data['prenom'] ?? $user->prenom,
            'telephone' => $data['telephone'] ?? $user->telephone,
        ]);

        if (!empty($data['photo']) && is_object($data['photo'])) {
            $path = $data['photo']->store('interns/photos', 'public');
            $data['photo'] = $path;
        } else {
            unset($data['photo']);
        }

        $dto = ApplicationDTO::fromRequest($data);
        $applicationData = $dto->toArray();
        $applicationData['user_id'] = $user->id;
        $applicationData['status'] = ApplicationStatus::Pending->value;
        $applicationData['etablissement'] = $applicationData['nom_complet_etablissement'] ?? '';

        return $this->applicationRepository->create($applicationData);
    }

    public function all(array $filters = [])
    {
        return $this->applicationRepository->paginate($filters);
    }

    public function findById(int $id): ?InternshipApplication
    {
        return $this->applicationRepository->findById($id);
    }

    public function findByUser(int $userId)
    {
        return $this->applicationRepository->findByUser($userId);
    }

    public function approve(int $id, array $data): InternshipApplication
    {
        $application = $this->applicationRepository->findById($id);
        if (!$application) {
            throw new \RuntimeException('Demande introuvable.');
        }

        $application = $this->applicationRepository->update($application, [
            'status' => ApplicationStatus::Approved->value,
            'department_id' => $data['department_id'],
        ]);

        $user = $application->user;
        $this->userRepository->update($user, [
            'role' => 'intern',
            'department_id' => $data['department_id'],
        ]);

        $qrToken = Str::random(64);

        $this->internRepository->create([
            'user_id' => $user->id,
            'supervisor_id' => $data['supervisor_id'],
            'department_id' => $data['department_id'],
            'application_id' => $application->id,
            'qr_token' => $qrToken,
            'date_debut' => $application->date_debut,
            'date_fin' => $application->date_fin,
            'status' => InternStatus::Active->value,
        ]);

        $this->applicationRepository->update($application, [
            'status' => ApplicationStatus::Active->value,
        ]);

        $this->auditService->log('approve', $application, null, ['status' => 'active']);

        return $application->fresh()->load('user', 'department', 'intern');
    }

    public function reject(int $id, string $motif): InternshipApplication
    {
        $application = $this->applicationRepository->findById($id);
        if (!$application) {
            throw new \RuntimeException('Demande introuvable.');
        }

        $updated = $this->applicationRepository->update($application, [
            'status' => ApplicationStatus::Rejected->value,
            'motif_refus' => $motif,
        ]);

        $this->auditService->log('reject', $application, null, ['status' => 'rejected', 'motif' => $motif]);

        return $updated;
    }

    public function markUnderReview(int $id): InternshipApplication
    {
        $application = $this->applicationRepository->findById($id);
        if (!$application) {
            throw new \RuntimeException('Demande introuvable.');
        }

        return $this->applicationRepository->update($application, [
            'status' => ApplicationStatus::UnderReview->value,
        ]);
    }
}




