<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPotentialVotersNumberToPolls extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('polls', function (Blueprint $table) {
      $table
        ->unsignedInteger('potential_voters_number')
        ->after('type_of_poll')
        ->default(0);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('polls', function (Blueprint $table) {
      //
    });
  }
}
