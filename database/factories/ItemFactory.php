<?php

namespace Database\Factories;

use App\Models\Item;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * Class ItemFactory
 *
 * @package Database\Factories
 */
class ItemFactory extends Factory
{
  /**
   * The name of the factory's corresponding model.
   *
   * @var string
   */
  protected $model = Item::class;

  /**
   * Define the model's default state.
   *
   * @return array
   */
  public function definition()
  {
    return [
      'name' => $this->faker->text,
      'thumb' => '/storage/images/items_thumbs/LookingAhead.jpg',
      'parent_id' => null,
      'source' => 'test.pdf',
      'is_category' => false,
    ];
  }
}
