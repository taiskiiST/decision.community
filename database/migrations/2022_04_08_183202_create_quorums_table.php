<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuorumsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quorums', function (Blueprint $table) {
            $table->id();
            $table->foreignId('poll_id')->constrained('polls', 'id')->cascadeOnDelete();
            $table->integer('count_of_voting_current')->default(0);
            $table->integer('all_users_that_can_vote');
            $table->string('list_of_all_current_users');
            $table->timestamps();

            $table->unique(['poll_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quorums');
    }
}
