<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChairmenTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('chairmen', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('chair_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table
        ->foreignId('man_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table->timestamps();

      $table->unique(['chair_id', 'man_id']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('chairmen');
  }
}
