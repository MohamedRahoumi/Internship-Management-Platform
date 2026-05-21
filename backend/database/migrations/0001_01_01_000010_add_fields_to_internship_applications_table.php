<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('internship_applications', function (Blueprint $table) {
            $table->string('civility')->nullable()->after('user_id');
            $table->string('photo')->nullable()->after('user_id');
            $table->string('type_etablissement')->nullable()->after('ville_etablissement');
        });
    }

    public function down(): void
    {
        Schema::table('internship_applications', function (Blueprint $table) {
            $table->dropColumn(['civility', 'photo', 'type_etablissement']);
        });
    }
};


