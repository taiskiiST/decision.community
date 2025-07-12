<?php

namespace Database\Seeders;

use App\Models\Entity;
use App\Models\Poll;
use Illuminate\Database\Seeder;

/**
 * Class EntityPollSeeder
 *
 * @package Database\Seeders
 */
class EntityPollSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $entities = Entity::all();
    $polls = Poll::all();

    foreach ($polls as $poll) {
      $poll->attachEntityIfNotAttached($entities->random());
    }
  }
}