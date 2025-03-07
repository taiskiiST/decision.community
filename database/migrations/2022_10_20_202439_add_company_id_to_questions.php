<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyIdToQuestions extends Migration
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
        ->foreignId('company_id')
        ->after('file_id')
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
    Schema::table('questions', function (Blueprint $table) {
      //
    });
  }
}
