<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyIdToPositions extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('positions', function (Blueprint $table) {
      $table
        ->foreignId('company_id')
        ->after('position')
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
    Schema::table('positions', function (Blueprint $table) {
      //
    });
  }
}
