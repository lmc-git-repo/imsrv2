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
        Schema::table('l3_switches', function (Blueprint $table) {
            $table->string('serial_number')->nullable()->after('model')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('l3_switches', function (Blueprint $table) {
            $table->string('serial_number')->nullable()->after('model');
        });
    }
};