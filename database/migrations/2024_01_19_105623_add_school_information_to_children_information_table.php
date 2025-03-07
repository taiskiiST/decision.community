<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSchoolInformationToChildrenInformationTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('children_information', function (Blueprint $table) {
      $table->string('school_time_from')->after('sex')->nullable();
      $table->string('school_time_to')->after('sex')->nullable();
      $table->string('school_address')->after('sex')->nullable();
      $table->string('school_name')->after('sex')->nullable();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('children_information', function (Blueprint $table) {
      //
    });
  }
}
