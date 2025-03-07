<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePresidiumMembersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('presidium_members', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('presidium_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table
        ->foreignId('member_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table->timestamps();

      $table->unique(['presidium_id', 'member_id']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('presidium_members');
  }
}
