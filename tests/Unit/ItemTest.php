<?php

namespace Tests\Unit;

use App\Models\Company;
use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ItemTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function does_not_add_a_user_visit_if_a_user_is_from_another_company()
    {
        $companyA = Company::factory()->create();

        $companyB = Company::factory()->create();

        $user = User::factory()->create([
            'company_id' => $companyA->id,
        ]);

        $anotherUser = User::factory()->create([
            'company_id' => $companyB->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $item->addVisit($anotherUser);

        $this->assertDatabaseMissing('item_visits', [
            'user_id' => $anotherUser->id,
            'item_id' => $item->id,
        ]);
    }

    /** @test */
    public function can_add_a_user_visit()
    {
        $user = User::factory()->create();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $item->addVisit($user);

        $this->assertDatabaseHas('item_visits', [
            'user_id' => $user->id,
            'item_id' => $item->id,
            'time' => now(),
        ]);
    }

    /** @test */
    public function a_category_can_get_all_its_children()
    {
        $categoryZ = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat Z',
        ]);

        $categoryY = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat Y',
            'parent_id'   => $categoryZ->id,
        ]);

        $categoryX = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat X',
            'parent_id'   => $categoryY->id,
        ]);

        $categoryB = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat B',
            'parent_id'   => $categoryX->id,
        ]);

        $categoryA = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat A',
            'parent_id'   => $categoryB->id,
        ]);

        $regularItem = Item::factory()->create([
            'is_category' => false,
            'parent_id'   => $categoryA->id,
        ]);

        $itemZChildren = $categoryZ->getAllChildren()->toArray();

        $this->assertContainsEquals($regularItem->toArray(), $itemZChildren);
        $this->assertContainsEquals($categoryA->toArray(), $itemZChildren);
        $this->assertContainsEquals($categoryB->toArray(), $itemZChildren);
        $this->assertContainsEquals($categoryX->toArray(), $itemZChildren);
        $this->assertContainsEquals($categoryY->toArray(), $itemZChildren);

        $itemXChildren = $categoryX->getAllChildren()->toArray();

        $this->assertContainsEquals($regularItem->toArray(), $itemXChildren);
        $this->assertContainsEquals($categoryA->toArray(), $itemXChildren);
        $this->assertContainsEquals($categoryB->toArray(), $itemXChildren);

        $this->assertContainsEquals($regularItem->toArray(), $categoryA->getAllChildren()->toArray());

        $this->assertEquals([], $regularItem->getAllChildren()->toArray());
    }

    /** @test */
    public function an_item_can_get_all_its_parents()
    {
        $categoryZ = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat Z',
        ]);

        $categoryY = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat Y',
            'parent_id'   => $categoryZ->id,
        ]);

        $categoryX = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat X',
            'parent_id'   => $categoryY->id,
        ]);

        $categoryB = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat B',
            'parent_id'   => $categoryX->id,
        ]);

        $categoryA = Item::factory()->create([
            'is_category' => true,
            'name'        => 'Cat A',
            'parent_id'   => $categoryB->id,
        ]);

        $regularItem = Item::factory()->create([
            'is_category' => false,
            'parent_id'   => $categoryA->id,
        ]);

        $regularItemParents = $regularItem->getAllParents()->toArray();

        $this->assertContainsEquals($categoryA->toArray(), $regularItemParents);
        $this->assertContainsEquals($categoryB->toArray(), $regularItemParents);
        $this->assertContainsEquals($categoryX->toArray(), $regularItemParents);
        $this->assertContainsEquals($categoryY->toArray(), $regularItemParents);
        $this->assertContainsEquals($categoryZ->toArray(), $regularItemParents);

        $itemXParents = $categoryX->getAllParents()->toArray();

        $this->assertContainsEquals($categoryY->toArray(), $itemXParents);
        $this->assertContainsEquals($categoryZ->toArray(), $itemXParents);

        $this->assertContainsEquals($categoryZ->toArray(), $categoryY->getAllParents()->toArray());

        $this->assertEquals([], $categoryZ->getAllParents()->toArray());
    }

    /** @test */
    public function a_category_can_count_items()
    {
        /** @var Item $category */
        $category = Item::factory()->create([
            'is_category' => true,
        ]);

        $regularItems = Item::factory()->count(10)->create([
            'parent_id' => $category->id,
        ]);

        $employeeItems = Item::factory()->employeeOnly()->count(3)->create([
            'parent_id' => $category->id,
        ]);

        $this->assertEquals($regularItems->count() + $employeeItems->count(), $category->countItems());
    }

    /** @test */
    public function a_category_can_count_items_available_to_authenticated_user()
    {
        $user = $this->signIn();

        /** @var Item $category */
        $category = Item::factory()->create([
            'company_id'  => $user->company_id,
            'is_category' => true,
        ]);

        $regularItems = Item::factory()->count(10)->create([
            'company_id' => $user->company_id,
            'parent_id'  => $category->id,
        ]);

        $employeeItems = Item::factory()->employeeOnly()->count(3)->create([
            'company_id' => $user->company_id,
            'parent_id'  => $category->id,
        ]);

        $this->assertEquals($regularItems->count(), $category->countItemsAvailableToUser());
    }

    /** @test */
    public function an_item_has_a_path()
    {
        $item = Item::factory()->create();

        $this->assertEquals("/items/$item->id", $item->path());
    }

    /** @test */
    public function an_item_can_be_employee_only()
    {
        $this->withoutExceptionHandling();

        $item = Item::factory()->employeeOnly()->create();

        $this->assertEquals(true, $item->isEmployeeOnly());
    }
}
