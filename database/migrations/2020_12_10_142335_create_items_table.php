<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateItemsTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('items', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('parent_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table->boolean('is_category')->default(false);
      $table->string('name');
      $table->string('thumb');
      $table->string('phone')->nullable();
      $table->string('address')->nullable();
      $table->string('pin')->nullable();
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
    Schema::dropIfExists('items');
  }
}
