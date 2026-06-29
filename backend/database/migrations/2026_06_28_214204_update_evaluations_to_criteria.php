<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->dropColumn([
                'competences_techniques',
                'communication',
                'discipline',
                'autonomie',
                'travail_equipe',
                'qualite_rapport',
            ]);
            $table->json('scores')->after('evaluator_id');
            $table->text('observations')->nullable()->after('note_finale');
        });
    }

    public function down(): void
    {
        Schema::table('evaluations', function (Blueprint $table) {
            $table->dropColumn(['scores', 'observations']);
            $table->integer('competences_techniques')->after('evaluator_id');
            $table->integer('communication');
            $table->integer('discipline');
            $table->integer('autonomie');
            $table->integer('travail_equipe');
            $table->integer('qualite_rapport');
        });
    }
};
