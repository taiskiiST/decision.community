<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Entity;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Class EntityUsersSeeder
 *
 * @package Database\Seeders
 */
class EntityUsersSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $entities = Entity::all();
    $users = User::all();

    foreach ($users as $user) {
      $user->entities()->syncWithoutDetaching($entities->random());
    }
  }
}