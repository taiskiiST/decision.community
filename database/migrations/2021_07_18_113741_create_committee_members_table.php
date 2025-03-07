<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommitteeMembersTable extends Migration
{
  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('committee_members', function (Blueprint $table) {
      $table->id();
      $table
        ->foreignId('committee_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table
        ->foreignId('member_id')
        ->nullable()
        ->constrained('items', 'id')
        ->cascadeOnDelete();
      $table->timestamps();

      $table->unique(['committee_id', 'member_id']);
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::dropIfExists('committee_members');
  }
}
