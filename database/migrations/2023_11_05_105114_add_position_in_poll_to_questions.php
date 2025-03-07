<?php

use App\Models\Poll;
use App\Models\Question;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPositionInPollToQuestions extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('questions', function (Blueprint $table) {
      $table
        ->unsignedSmallInteger('position_in_poll')
        ->nullable()
        ->default(null)
        ->after('poll_id');
    });

    Poll::all()->each(function (Poll $poll) {
      $poll->reSortQuestions();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('questions', function (Blueprint $table) {
      //
    });
  }
}
