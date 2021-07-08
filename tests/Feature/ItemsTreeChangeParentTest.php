<?php

namespace Tests\Feature;

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemsTreeChangeParentTest extends TestCase
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
            'parent_id' => null
        ]);

        /** @var Item $parent */
        $parent = Item::factory()->create([
            'name' => 'Parent',
            'company_id' => $user->company_id,
            'is_category' => true
        ]);

        /*
        |--------------------------------------------------------------------------
        | No id is supplied.
        |--------------------------------------------------------------------------
        */

        $this->put(route('items-tree.update-item-parent'), [
            'parentId' => $parent->id,
        ])->assertNotFound();

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'parent_Id' => $parent->id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Non-existing id is supplied.
        |--------------------------------------------------------------------------
        */

        $nonExistingItemId = $item->id + $parent->id + 777;

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $nonExistingItemId,
            'parentId' => $parent->id,
        ])->assertNotFound();

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'parent_Id' => $parent->id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function if_parent_is_supplied_it_has_to_exist()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'parent_id' => null
        ]);

        /** @var Item $parent */
        $parent = Item::factory()->create([
            'name' => 'Parent',
            'company_id' => $user->company_id,
            'is_category' => true
        ]);

        $nonExistingParentId = $item->id + $parent->id + 777;

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $item->id,
            'parentId' => $nonExistingParentId,
        ])->assertSessionHasErrors('parentId');;

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'parentId' => $nonExistingParentId,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function if_parent_is_supplied_it_has_to_be_a_category()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'parent_id' => null
        ]);

        /** @var Item $parent */
        $parent = Item::factory()->create([
            'name' => 'Parent',
            'company_id' => $user->company_id,
            'is_category' => false
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $item->id,
            'parentId' => $parent->id,
        ])->assertJson([
            'errorMessage' => 'Cannot move item: the destination is not a category'
        ]);

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'parent_Id' => $parent->id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_moving_an_item_to_an_employee_only_parent_the_resulting_item_must_become_employee_only()
    {
        $user = $this->signInAsManager();

        /** @var Item $nonEmployeeItem */
        $nonEmployeeItem = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'parent_id' => null,
            'employee_only' => false
        ]);

        /** @var Item $parent */
        $parent = Item::factory()->create([
            'name' => 'Parent',
            'company_id' => $user->company_id,
            'is_category' => true,
            'employee_only' => true
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $nonEmployeeItem->id,
            'parentId' => $parent->id,
        ])->assertOk();

        $this->assertDatabaseHas('items', [
            'name' => $nonEmployeeItem->name,
            'company_id' => $user->company_id,
            'parent_Id' => $parent->id,
            'employee_only' => true
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_moving_an_item_to_a_regular_parent_the_resulting_item_must_preserve_its_employee_only_status()
    {
        $user = $this->signInAsManager();

        /** @var Item $nonEmployeeOnlyParent */
        $nonEmployeeOnlyParent = Item::factory()->create([
            'name' => 'Parent',
            'company_id' => $user->company_id,
            'is_category' => true,
            'employee_only' => false
        ]);

        /*
        |--------------------------------------------------------------------------
        | Employee-only item.
        |--------------------------------------------------------------------------
        */

        /** @var Item $employeeOnlyItem */
        $employeeOnlyItem = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'parent_id' => null,
            'employee_only' => true
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $employeeOnlyItem->id,
            'parentId' => $nonEmployeeOnlyParent->id,
        ])->assertOk();

        $this->assertDatabaseHas('items', [
            'name' => $employeeOnlyItem->name,
            'company_id' => $user->company_id,
            'parent_Id' => $nonEmployeeOnlyParent->id,
            'employee_only' => true
        ]);

        /*
        |--------------------------------------------------------------------------
        | Non-employee-only item.
        |--------------------------------------------------------------------------
        */

        /** @var Item $nonEmployeeOnlyItem */
        $nonEmployeeOnlyItem = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'parent_id' => null,
            'employee_only' => false
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $nonEmployeeOnlyItem->id,
            'parentId' => $nonEmployeeOnlyParent->id,
        ])->assertOk();

        $this->assertDatabaseHas('items', [
            'name' => $nonEmployeeOnlyItem->name,
            'company_id' => $user->company_id,
            'parent_Id' => $nonEmployeeOnlyParent->id,
            'employee_only' => false
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_moving_a_regular_category_to_an_employee_only_parent_the_resulting_category_and_all_its_children_must_become_employee_only()
    {
        $user = $this->signInAsManager();

        /** @var Item $employeeOnlyCategoryToMoveTo */
        $employeeOnlyCategoryToMoveTo = Item::factory()->create([
            'name' => 'Employee-only Category',
            'company_id' => $user->company_id,
            'parent_id' => null,
            'employee_only' => true,
            'is_category' => true
        ]);

        /** @var Item $nonEmployeeCategoryToBeMoved */
        $nonEmployeeCategoryToBeMoved = Item::factory()->create([
            'name' => 'Category',
            'company_id' => $user->company_id,
            'parent_id' => null,
            'employee_only' => false,
            'is_category' => true
        ]);

        /** @var Item $nonEmployeeSubCategory */
        $nonEmployeeSubCategory = Item::factory()->create([
            'name' => 'Sub Category',
            'company_id' => $user->company_id,
            'parent_id' => $nonEmployeeCategoryToBeMoved->id,
            'employee_only' => false,
            'is_category' => true
        ]);

        /** @var Item $nonEmployeeSubSubCategory */
        $nonEmployeeSubSubCategory = Item::factory()->create([
            'name' => 'Sub SubCategory',
            'company_id' => $user->company_id,
            'parent_id' => $nonEmployeeSubCategory->id,
            'employee_only' => false
        ]);

        $nonEmployeeOnlyItems = Item::factory()->count(5)->create([
            'name' => 'Non-employee items Level 1',
            'company_id' => $user->company_id,
            'parent_id' => $nonEmployeeCategoryToBeMoved->id,
            'employee_only' => false
        ]);

        $nonEmployeeOnlyItems->merge(
            Item::factory()->count(5)->create([
                'name' => 'Non-employee items Level 2',
                'company_id' => $user->company_id,
                'parent_id' => $nonEmployeeSubCategory->id,
                'employee_only' => false
            ])
        );

        $nonEmployeeOnlyItems->merge(
            Item::factory()->count(5)->create([
                'name' => 'Non-employee items Level 3',
                'company_id' => $user->company_id,
                'parent_id' => $nonEmployeeSubSubCategory->id,
                'employee_only' => false
            ])
        );

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $nonEmployeeCategoryToBeMoved->id,
            'parentId' => $employeeOnlyCategoryToMoveTo->id,
        ])->assertOk();

        // Check the category we moved.
        $this->assertDatabaseHas('items', [
            'id' => $nonEmployeeCategoryToBeMoved->id,
            'name' => $nonEmployeeCategoryToBeMoved->name,
            'company_id' => $nonEmployeeCategoryToBeMoved->company_id,
            'parent_Id' => $employeeOnlyCategoryToMoveTo->id,
            'employee_only' => true
        ]);

        // Check all its children.
        $nonEmployeeCategoryToBeMoved->getAllChildren()->each(function (Item $item) {
            $this->assertDatabaseHas('items', [
                'id' => $item->id,
                'name' => $item->name,
                'company_id' => $item->company_id,
                'parent_Id' => $item->parent_id,
                'employee_only' => true
            ]);
        });
    }
}
