<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('internship_reports', function (Blueprint $table) {
            $table->string('titre')->nullable()->change();
            $table->text('description')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('internship_reports', function (Blueprint $table) {
            $table->string('titre')->nullable(false)->change();
            $table->text('description')->nullable(false)->change();
        });
    }
};
