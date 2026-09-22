<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Roof photos attached to an estimate request. Files live on the private
 * "local" disk (storage/app/private) and are only served to a signed-in
 * admin through the API, never by URL.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submission_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('submission_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('original_name');
            $table->string('mime_type', 50);
            $table->unsignedInteger('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submission_photos');
    }
};
