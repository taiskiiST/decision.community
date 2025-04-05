<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Entity;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Class EntitysSeeder
 *
 * @package Database\Seeders
 */
class EntitySeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    $categories = $this->seedFirstLevelCategories();
  }

  /**
   * @return \Illuminate\Support\Collection
   */
  protected function seedFirstLevelCategories()
  {
    $out = new Collection();

    foreach (Storage::files('public/images/organizations') as $file) {
      $fileName = Str::afterLast($file, '/');

      $destination = "public/images/entity_thumbs/$fileName";

      if (!Storage::exists($destination)) {
        Storage::copy($file, $destination);
      }

      $company = Company::first();
      if (!$company) {
        return;
      }

      $out->push(
        Entity::create([
          'name' => Str::before($fileName, '_'),
          'thumb' => $fileName,
          'phone' => Str::before(Str::afterLast($fileName, '_'), '.'),
          'parent_id' => null,
          'company_id' => $company->id
        ])
      );
    }
  }
}
