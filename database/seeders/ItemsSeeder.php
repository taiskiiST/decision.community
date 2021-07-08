<?php

namespace Database\Seeders;

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

        foreach (Storage::files('images_pool') as $file) {
            $fileName = Str::after($file, '/');

            $destination = "public/images/items_thumbs/$fileName";

            if (! Storage::exists($destination)) {
                Storage::copy($file, $destination);
            }
        }

        $out->push(Item::create([
            'name' => 'Съезд',
            'thumb' => 'category1.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Региональное собрание 61',
            'thumb' => 'category2.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Местное отделение Аксайского района',
            'thumb' => 'category3.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Орг комитет Атлант-сити',
            'thumb' => 'category4.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Пупкин координатор рынка',
            'thumb' => 'category5.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Координатор рынка №1',
            'thumb' => 'category6.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Сегмент рынка А',
            'thumb' => 'category7.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Ячейка рынка сегмента А',
            'thumb' => 'category8.jpg',
            'is_category' => true,
            'phone' => '9887772211'
        ]));

        $out->push(Item::create([
            'name' => 'Иванов Иван Иванович',
            'thumb' => 'category9.jpg',
            'is_category' => false,
            'phone' => '9887772211'
        ]));

        return $out;
    }
}
