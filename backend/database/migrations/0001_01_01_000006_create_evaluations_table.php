<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('intern_id')->constrained()->cascadeOnDelete();
            $table->foreignId('evaluator_id')->constrained('users')->cascadeOnDelete();
            $table->integer('competences_techniques');
            $table->integer('communication');
            $table->integer('discipline');
            $table->integer('autonomie');
            $table->integer('travail_equipe');
            $table->integer('qualite_rapport');
            $table->decimal('note_finale', 5, 2);
            $table->text('commentaire_general')->nullable();
            $table->string('recommandation')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};


