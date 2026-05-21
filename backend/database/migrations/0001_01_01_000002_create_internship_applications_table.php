<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('internship_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('cycle_formation');
            $table->string('niveau_etude');
            $table->string('etablissement');
            $table->string('ville_etablissement');
            $table->string('nom_complet_etablissement');
            $table->string('specialite');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->integer('duree');
            $table->string('status')->default('pending');
            $table->text('motif_refus')->nullable();
            $table->boolean('whatsapp_confirmed')->default(false);
            $table->boolean('dossier_envoye')->default(false);
            $table->boolean('conditions_acceptees')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('internship_applications');
    }
};


