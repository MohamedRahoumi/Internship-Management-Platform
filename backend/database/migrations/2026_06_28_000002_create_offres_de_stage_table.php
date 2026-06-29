<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('offres_de_stage', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('intern_id')->constrained()->cascadeOnDelete();
            $table->foreignId('application_id')->constrained('internship_applications')->cascadeOnDelete();
            $table->foreignId('generated_by')->constrained('users');
            $table->string('file_path');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offres_de_stage');
    }
};
