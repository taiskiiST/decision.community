<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRevPresidiumMembersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('rev_presidium_members', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('rev_presidium_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table
        ->foreignId('member_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table->timestamps();

      $table->unique(['rev_presidium_id', 'member_id']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('rev_presidium_members');
  }
}
