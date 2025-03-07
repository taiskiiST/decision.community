<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRightsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('rights', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table
        ->foreignId('type_of_right')
        ->constrained('types_of_rights')
        ->cascadeOnDelete();
      $table->double('weight');
      $table->double('number_of_share');
      $table->string('grounds');
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
    Schema::dropIfExists('rights');
  }
}
