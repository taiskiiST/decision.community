<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyIdToOrganizers extends Migration
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
        ->foreignId('company_id')
        ->after('users_invited_id')
        ->default(1)
        ->constrained('companies')
        ->cascadeOnDelete();
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
