<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

/**
 * Class DatabaseSeeder
 *
 * @package Database\Seeders
 */
class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   *
   * @return void
   */
  public function run()
  {
    $this->call(TypesOfPollsSeeder::class);

    Company::create([
      'uri' => 'berezka',
      'title' => 'Берёзка',
      'description' => 'ТНС',
    ]);

    $this->call(UsersSeeder::class);

    $this->call(PollSeeder::class);
  }
}
