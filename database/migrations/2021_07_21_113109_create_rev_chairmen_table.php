<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRevChairmenTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('rev_chairmen', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('rev_chair_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table
        ->foreignId('man_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table->timestamps();

      $table->unique(['rev_chair_id', 'man_id']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('rev_chairmen');
  }
}
