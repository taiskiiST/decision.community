<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Entity;
use Illuminate\Database\Seeder;

/**
 * Class CompanyEntitiesSeeder
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
    $companies = Company::all();

    foreach ($entities as $entity) {
      $entity->attachCompanyIfNotAttached($companies->random());
    }
  }
}