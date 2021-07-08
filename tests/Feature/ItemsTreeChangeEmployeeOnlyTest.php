<?php

namespace Tests\Feature;

use App\Http\Livewire\ItemsList;
use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ItemsTreeChangeEmployeeOnlyTest extends TestCase
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

        $this->put(route('items-tree.update-item-employee-only'), [
            'employeeOnly' => true,
        ])->assertNotFound();

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'employee_only' => true,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Non-existing id is supplied.
        |--------------------------------------------------------------------------
        */

        $nonExistingItemId = $item->id + 777;

        $this->put(route('items-tree.update-item-employee-only'), [
            'id' => $nonExistingItemId,
            'employeeOnly' => true,
        ])->assertNotFound();

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'employee_only' => true,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function employee_only_parameter_is_required()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'employee_only' => false,
        ]);

        $this->put(route('items-tree.update-item-employee-only'), [
            'id' => $item->id,
        ])->assertSessionHasErrors('employeeOnly');

        $this->assertDatabaseMissing('items', [
            'name' => $item->name,
            'company_id' => $user->company_id,
            'employee_only' => true,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function an_item_cannot_be_made_non_employee_if_one_of_its_parents_is_employee_only()
    {
        $user = $this->signInAsManager();

        /** @var Item $employeeOnlyGrandGrandParent */
        $employeeOnlyGrandGrandParent = Item::factory()->create([
            'name' => 'Grand Grand Parent',
            'company_id' => $user->company_id,
            'is_category' => true,
            'employee_only' => true
        ]);

        /** @var Item $nonEmployeeOnlyGrandParent */
        $nonEmployeeOnlyGrandParent = Item::factory()->create([
            'name' => 'Grand Parent',
            'company_id' => $user->company_id,
            'parent_id' => $employeeOnlyGrandGrandParent->id,
            'is_category' => true,
            'employee_only' => false
        ]);

        /** @var Item $nonEmployeeOnlyParent */
        $nonEmployeeOnlyParent = Item::factory()->create([
            'name' => 'Parent',
            'company_id' => $user->company_id,
            'parent_id' => $nonEmployeeOnlyGrandParent->id,
            'is_category' => true,
            'employee_only' => false
        ]);

        /** @var Item $employeeOnlyItem */
        $employeeOnlyItem = Item::factory()->create([
            'name' => 'Item A',
            'company_id' => $user->company_id,
            'parent_id' => $nonEmployeeOnlyParent->id,
            'employee_only' => true
        ]);

        $this->put(route('items-tree.update-item-employee-only'), [
            'id' => $employeeOnlyItem->id,
            'employeeOnly' => false,
        ])->assertJson([
            'errorMessage' => 'Cannot uncheck "Employee Only" because one of the parents is "Employee Only"'
        ]);

        $this->assertDatabaseMissing('items', [
            'name' => $employeeOnlyItem->name,
            'company_id' => $user->company_id,
            'employee_only' => false,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_making_a_category_employee_only_all_its_children_must_become_employee_only()
    {
        $user = $this->signInAsManager();

        /** @var Item $nonEmployeeCategoryToBeChanged */
        $nonEmployeeCategoryToBeChanged = Item::factory()->create([
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
            'parent_id' => $nonEmployeeCategoryToBeChanged->id,
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
            'parent_id' => $nonEmployeeCategoryToBeChanged->id,
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

        $this->put(route('items-tree.update-item-employee-only'), [
            'id' => $nonEmployeeCategoryToBeChanged->id,
            'employeeOnly' => true,
        ])->assertOk();

        // Check the category.
        $this->assertDatabaseHas('items', [
            'id' => $nonEmployeeCategoryToBeChanged->id,
            'parent_id' => $nonEmployeeCategoryToBeChanged->parent_id,
            'name' => $nonEmployeeCategoryToBeChanged->name,
            'company_id' => $nonEmployeeCategoryToBeChanged->company_id,
            'employee_only' => true
        ]);

        // Check all its children.
        $nonEmployeeCategoryToBeChanged->getAllChildren()->each(function (Item $item) {
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
