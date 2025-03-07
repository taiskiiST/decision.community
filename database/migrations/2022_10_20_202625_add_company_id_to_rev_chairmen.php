<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyIdToRevChairmen extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('rev_chairmen', function (Blueprint $table) {
      $table
        ->foreignId('company_id')
        ->after('man_id')
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
    Schema::table('rev_chairmen', function (Blueprint $table) {
      //
    });
  }
}
