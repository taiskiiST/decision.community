<?php

namespace Tests\Unit;

use App\Models\Company;
use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class UserTest
 *
 * @package Tests\Unit
 */
class UserTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function a_user_has_favorite_items()
    {
        $user = User::factory()->create();

        $itemA = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id
        ]);

        $itemB = Item::factory()->create([
            'name' => 'Item B',
            'company_id' => $user->company_id
        ]);

        $user->addItemToFavorites($itemA);
        $user->addItemToFavorites($itemB);

        $this->assertEquals(collect([
            $itemA,
            $itemB
        ])->pluck('id'), $user->favorites->pluck('id'));
    }

    /** @test */
    public function a_user_can_only_add_an_item_to_favorites_if_it_is_available_to_them()
    {
        $companyA = Company::factory()->create();

        $companyB = Company::factory()->create();

        $user = User::factory()->create([
            'company_id' => $companyA->id,
        ]);

        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $companyB->id,
        ]);

        $user->addItemToFavorites($item);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function a_user_can_add_an_item_to_favorites()
    {
        $user = User::factory()->create();

        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id
        ]);

        $user->addItemToFavorites($item);

        $this->assertDatabaseHas('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function a_user_cannot_add_a_category_to_favorites()
    {
        $user = User::factory()->create();

        $item = Item::factory()->create([
            'name' => 'Category A',
            'is_category' => true,
            'company_id' => $user->company_id
        ]);

        $user->addItemToFavorites($item);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function a_user_can_remove_an_item_from_favorites()
    {
        $user = User::factory()->create();

        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id
        ]);

        $user->removeItemFromFavorites($item);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function a_user_can_toggle_favorite_item()
    {
        $user = User::factory()->create();

        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id
        ]);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);

        $user->toggleFavorite($item);

        $this->assertDatabaseHas('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);

        $user->toggleFavorite($item);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function a_user_can_only_toggle_favorite_item_if_it_is_available_to_them()
    {
        $companyA = Company::factory()->create();

        $companyB = Company::factory()->create();

        $user = User::factory()->create([
            'company_id' => $companyA->id,
        ]);

        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $companyB->id,
        ]);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);

        $user->toggleFavorite($item);

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }
}
