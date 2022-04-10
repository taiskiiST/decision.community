<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrganizersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('organizers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poll_id')->constrained('polls', 'id')->cascadeOnDelete();
            $table->foreignId('user_chairman_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->foreignId('user_secretary_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->foreignId('user_counter_votes_id')->constrained('users', 'id')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['poll_id', 'user_chairman_id', 'user_secretary_id','user_counter_votes_id'], 'unique_organizers');
            $table->unique(['user_chairman_id', 'user_secretary_id']);
            $table->unique(['user_chairman_id', 'user_counter_votes_id']);
            $table->unique(['user_secretary_id', 'user_counter_votes_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('organizers');
    }
}
