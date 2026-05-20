<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Informatique', 'description' => 'Département des technologies de l\'information'],
            ['name' => 'Maintenance', 'description' => 'Département de maintenance industrielle'],
            ['name' => 'Production', 'description' => 'Département de production'],
            ['name' => 'Finance', 'description' => 'Département financier et comptable'],
            ['name' => 'Ressources Humaines', 'description' => 'Département des ressources humaines'],
            ['name' => 'Logistique', 'description' => 'Département logistique'],
            ['name' => 'Qualité', 'description' => 'Département qualité'],
        ];

        foreach ($departments as $dept) {
            Department::create($dept);
        }
    }
}


