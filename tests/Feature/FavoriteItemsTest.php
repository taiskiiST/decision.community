<?php

namespace Tests\Feature;

use App\Http\Livewire\ItemsList;
use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class FavoriteItemsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function an_item_can_be_added_to_favorites()
    {
        $company = Company::factory()->create();

        $user = $this->signIn([
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A'
        ]);

        Livewire::test(ItemsList::class)
                ->call('toggleFavorite', $item->id)
                ;//->assertSeeHtml('<svg class="filed" />');

        $this->assertDatabaseHas('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function an_item_can_be_removed_from_favorites()
    {
        $company = Company::factory()->create();

        $user = $this->signIn([
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A'
        ]);

        // First add an item to favorites.
        $user->addItemToFavorites($item);

        $this->assertDatabaseHas('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);

        Livewire::test(ItemsList::class)
                ->call('toggleFavorite', $item->id)
                ;//->assertSeeHtml('<svg class="filed" />');

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $item->id
        ]);
    }

    /** @test */
    public function a_category_cannot_be_added_to_favorites()
    {
        $company = Company::factory()->create();

        $user = $this->signIn([
            'company_id' => $company->id,
        ]);

        $category = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A',
            'is_category' => true
        ]);

        Livewire::test(ItemsList::class)
                ->call('toggleFavorite', $category->id)
                ->assertDontSeeHtml('<svg class="filed" />');

        $this->assertDatabaseMissing('users_favorites', [
            'user_id' => $user->id,
            'item_id' => $category->id
        ]);
    }

    /** @test */
    public function a_user_can_view_their_favorite_items()
    {
        $company = Company::factory()->create();

        $user = $this->signIn([
            'company_id' => $company->id,
        ]);

        $itemA = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A'
        ]);

        $itemB = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item B'
        ]);

        $itemC = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item C'
        ]);

        $user->addItemToFavorites($itemA);
        $user->addItemToFavorites($itemB);
        $user->addItemToFavorites($itemC);

        $itemD = Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item D'
        ]);

        $this->withoutExceptionHandling();

        $this->get('/items/favorites')
            ->assertOk()
            ->assertSeeText($itemA->name)
            ->assertSeeText($itemB->name)
            ->assertSeeText($itemC->name)
            ->assertDontSeeText($itemD->name)
        ;
    }
}
