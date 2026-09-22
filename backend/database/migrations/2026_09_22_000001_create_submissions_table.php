<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * One row per form submission, from either website form.
 *
 * Anything the dashboard searches, filters, sorts or lists is a real column.
 * Answers that only appear on the detail view live in `details` (JSON), so a
 * new question on the estimate form needs no migration.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('submissions', function (Blueprint $table) {
            $table->id();
            $table->string('form_type', 20);                // quick | estimate
            $table->string('status', 20)->default('new');   // new | read | contacted

            $table->string('name', 120);
            $table->string('phone', 30);
            $table->string('phone_digits', 15)->index();    // "6035551234", for search
            $table->string('email', 190)->nullable();
            $table->string('town', 120)->nullable();
            $table->string('address')->nullable();
            $table->string('service', 120)->nullable();
            $table->text('message')->nullable();
            $table->json('details')->nullable();

            $table->string('source_page')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();

            $table->timestamp('read_at')->nullable();
            $table->timestamp('contacted_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['form_type', 'created_at']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('submissions');
    }
};
