<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'role' => 'administrator',
            'cin' => 'ADMIN001',
            'civility' => 'M.',
            'nom' => 'Admin',
            'prenom' => 'Super',
            'telephone' => '0600000000',
            'email' => 'admin@stagaire.com',
            'password' => bcrypt('password'),
            'is_active' => true,
        ]);

        User::create([
            'role' => 'rh',
            'cin' => 'RH001',
            'civility' => 'Mme',
            'nom' => 'Rh',
            'prenom' => 'Manager',
            'telephone' => '0600000001',
            'email' => 'rh@stagaire.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'department_id' => 5,
        ]);

        User::create([
            'role' => 'supervisor',
            'cin' => 'SUP001',
            'civility' => 'M.',
            'nom' => 'Encadrant',
            'prenom' => 'Principal',
            'telephone' => '0600000002',
            'email' => 'supervisor@stagaire.com',
            'password' => bcrypt('password'),
            'is_active' => true,
            'department_id' => 1,
        ]);
    }
}
