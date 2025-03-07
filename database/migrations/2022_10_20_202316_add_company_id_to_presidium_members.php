<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyIdToPresidiumMembers extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('presidium_members', function (Blueprint $table) {
      $table
        ->foreignId('company_id')
        ->after('member_id')
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
    Schema::table('presidium_members', function (Blueprint $table) {
      //
    });
  }
}
