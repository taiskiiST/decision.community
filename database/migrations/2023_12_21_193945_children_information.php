<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChildrenInformation extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('children_information', function (Blueprint $table) {
      $table->id();
      $table->string('full_name');
      $table
        ->foreignId('parents_id')
        ->constrained('parents_information')
        ->cascadeOnDelete();
      $table->date('date_of_birthday');
      $table->string('sex');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    //
  }
}
