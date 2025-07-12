<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Entity;
use Illuminate\Database\Seeder;

/**
 * Class EntitysSeeder
 *
 * @package Database\Seeders
 */
class CompanyEntitiesSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $entities = Entity::all();

    foreach ($entities as $entity) {
      $company = Company::find((rand(0, 4) % 4) + 1);
      if (!$company) {
        continue;
      }

      $company->entities()->attach($entity);
    }
  }
}