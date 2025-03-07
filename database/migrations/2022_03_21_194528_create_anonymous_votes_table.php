<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAnonymousVotesTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('anonymous_votes', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('question_id')
        ->constrained('questions')
        ->cascadeOnDelete();
      $table->foreignId('answer_id')->constrained('answers')->cascadeOnDelete();
      $table
        ->foreignId('anonymous_user_id')
        ->constrained('anonymous_users')
        ->cascadeOnDelete();
      $table->timestamps();

      $table->unique(['anonymous_user_id', 'question_id']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('anonymous_votes');
  }
}
