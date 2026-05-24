<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDurationForCycle implements ValidationRule
{
    private const DURATION_MAP = [
        'OFPPT' => ['max' => null, 'niveau_overrides' => []],
        'HSE Centre de formation privé' => ['max' => 1, 'niveau_overrides' => []],
        'YouCode' => ['max' => 2, 'niveau_overrides' => []],
        'B.T.S' => ['max' => null, 'niveau_overrides' => [
            '1ère Année' => 1, '2ème Année' => 2,
        ]],
        'D.U.T (E.S.T, ENSET...)' => ['max' => null, 'niveau_overrides' => [
            '1ère Année' => 1, '2ème Année' => 2,
        ]],
        'D.E.U.G' => ['max' => 1, 'niveau_overrides' => []],
        'Tronc Commun' => ['max' => 1, 'niveau_overrides' => []],
        'Classes Préparatoires' => ['max' => 1, 'niveau_overrides' => []],
        'Licence' => ['max' => 3, 'niveau_overrides' => []],
        'Licence d\'excellence' => ['max' => 3, 'niveau_overrides' => []],
        'Bachelor 3rd year' => ['max' => 3, 'niveau_overrides' => []],
        'Bachelor 4th year EL AKHAWAYN' => ['max' => 2, 'niveau_overrides' => []],
        'Cycle Supérieur (Écoles de Gestion et Commerce)' => ['max' => null, 'niveau_overrides' => [
            'Bac+3' => 1,
        ]],
        'Master' => ['max' => 4, 'niveau_overrides' => []],
        'Cycle d\'Ingénieur' => ['max' => null, 'niveau_overrides' => [
            'Bac+3' => 1, 'Bac+4' => 2, 'Bac+5' => 4,
        ]],
        'Doctorant' => ['max' => 4, 'niveau_overrides' => []],
    ];

    public function __construct(
        private readonly string $cycleFormation,
        private readonly string $niveauEtude,
    ) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $duree = (int) $value;
        $cycle = $this->cycleFormation;

        if (!isset(self::DURATION_MAP[$cycle])) {
            return;
        }

        $config = self::DURATION_MAP[$cycle];

        if (isset($config['niveau_overrides'][$this->niveauEtude])) {
            $max = $config['niveau_overrides'][$this->niveauEtude];
        } else {
            $max = $config['max'];
        }

        if ($max === null) {
            return;
        }

        if ($duree > $max) {
            $fail("La durée maximale pour ce cycle ({$cycle}) est de {$max} mois.");
        }
    }
}




