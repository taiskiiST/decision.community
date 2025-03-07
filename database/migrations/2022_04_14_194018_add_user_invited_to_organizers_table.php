<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUserInvitedToOrganizersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('organizers', function (Blueprint $table) {
      $table
        ->text('users_invited_id')
        ->nullable()
        ->after('user_counter_votes_id');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('organizers', function (Blueprint $table) {
      //
    });
  }
}
