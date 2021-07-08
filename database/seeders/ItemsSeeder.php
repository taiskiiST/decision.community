<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Item;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Class ItemsSeeder
 *
 * @package Database\Seeders
 */
class ItemsSeeder extends Seeder
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

        $companies = Company::whereIn('id', [CompaniesSeeder::COALLIANCE_ID, CompaniesSeeder::UNITED_PRAIRIE_ID])->get();

        foreach (Storage::files('images_pool') as $file) {
            $fileName = Str::after($file, '/');

            $destination = "public/images/companies/10/items_thumbs/$fileName";

            if (! Storage::exists($destination)) {
                Storage::copy($file, $destination);
            }
        }

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Bayer Delaro',
            'thumb' => 'category1.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'CPP Videos',
            'thumb' => 'category2.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'AMVAC',
            'thumb' => 'category3.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Ag Teck (Co-Alliance)',
            'thumb' => 'category4.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'BASF Advanced Plant',
            'thumb' => 'category5.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'BASF Programs',
            'thumb' => 'category6.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Bayer Programs & Product',
            'thumb' => 'category7.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Bayer Stratego YLD',
            'thumb' => 'category8.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Biostimulant Products Showcase',
            'thumb' => 'category9.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Corteva Programs And Products',
            'thumb' => 'category10.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        $out->push(Item::create([
            'company_id' => $companies->random()->id,
            'name' => 'Credit',
            'thumb' => 'category11.jpg',
            'is_category' => true,
            'employee_only' => rand(0, 100) > 50,
        ]));

        return $out;
    }
}
