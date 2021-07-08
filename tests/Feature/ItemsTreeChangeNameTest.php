<?php

namespace Tests\Feature;

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemsTreeChangeNameTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function item_has_to_exist()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'employee_only' => false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | No id is supplied.
        |--------------------------------------------------------------------------
        */

        $newName = 'New Name';

        $this->put(route('items-tree.update-item-name'), [
            'name' => $newName,
        ])->assertNotFound();

        $this->assertDatabaseMissing('items', [
            'name' => $newName,
            'company_id' => $user->company_id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Non-existing id is supplied.
        |--------------------------------------------------------------------------
        */

        $nonExistingItemId = $item->id + 777;

        $this->put(route('items-tree.update-item-name'), [
            'id' => $nonExistingItemId,
            'name' => $newName,
        ])->assertNotFound();

        $this->assertDatabaseMissing('items', [
            'name' => $newName,
            'company_id' => $user->company_id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function name_parameter_is_required()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'employee_only' => false,
        ]);

        $this->put(route('items-tree.update-item-name'), [
            'id' => $item->id,
        ])->assertSessionHasErrors('name');

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'employee_only' => true,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function items_name_is_updated()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $newName = 'New Name';

        $this->put(route('items-tree.update-item-name'), [
            'id'   => $item->id,
            'name' => $newName,
        ])->assertOk();

        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'name' => $newName
        ]);
    }
}
