<?php

namespace Tests\Feature;

use App\Http\Livewire\ItemsList;
use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ViewItemsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function only_categories_can_be_accessed_via_show_method()
    {
        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'is_category' => false
        ]);

        $this->get($item->path())->assertForbidden();
    }

    /** @test */
    public function hierarchical_breadcrumbs_are_shown_on_the_page_in_the_right_order()
    {
        $user = $this->signIn();

        $categoryZ = Item::factory()->create([
            'is_category' => true,
            'company_id' => $user->company_id,
            'name' => 'Cat Z',
        ]);

        $categoryY = Item::factory()->create([
            'is_category' => true,
            'company_id' => $user->company_id,
            'name' => 'Cat Y',
            'parent_id' => $categoryZ->id,
        ]);

        $categoryX = Item::factory()->create([
            'is_category' => true,
            'company_id' => $user->company_id,
            'name' => 'Cat X',
            'parent_id' => $categoryY->id,
        ]);

        $categoryB = Item::factory()->create([
            'is_category' => true,
            'company_id' => $user->company_id,
            'name' => 'Cat B',
            'parent_id' => $categoryX->id,
        ]);

        $categoryA = Item::factory()->create([
            'is_category' => true,
            'company_id' => $user->company_id,
            'name' => 'Cat A',
            'parent_id' => $categoryB->id,
        ]);

        $rightOrder = [
            'Top Level',
            $categoryZ->name,
            $categoryY->name,
            $categoryX->name,
            $categoryB->name,
            $categoryA->name,
            'No Items Found'
        ];

        Livewire::test(ItemsList::class, ['category' => $categoryA])
                ->set('search', 'ABC')
                ->assertSeeInOrder($rightOrder);
    }

    /** @test */
    public function items_can_be_sorted_in_alphabetical_order()
    {
        $company = Company::factory()->create();

        $this->signIn([
            'company_id' => $company->id,
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A',
            'created_at' => now()->subHours(3),
            'updated_at' => now()->subHours(3),
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item B',
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item C',
            'created_at' => now()->subHour(),
            'updated_at' => now()->subHour(),
        ]);

        Livewire::test(ItemsList::class)
                ->set('sortBy', ItemsList::SORT_ALPHABETICALLY)
                ->assertSeeInOrder(['Item A', 'Item B', 'Item C']);
    }

    /** @test */
    public function items_can_be_sorted_by_latest()
    {
        /** @var \App\Models\Company $company */
        $company = Company::factory()->create();

        $this->signIn([
            'company_id' => $company->id,
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A',
            'created_at' => now()->subHours(3),
            'updated_at' => now()->subHours(3),
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item B',
            'created_at' => now()->subHours(2),
            'updated_at' => now()->subHours(2),
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item C',
            'created_at' => now()->subHour(),
            'updated_at' => now()->subHour(),
        ]);

        Livewire::test(ItemsList::class)
                ->set('sortBy', ItemsList::SORT_BY_LATEST)
                ->assertSeeInOrder(['Item C', 'Item B', 'Item A']);
    }

    /** @test */
    public function items_can_be_filtered_by_name()
    {
        $company = Company::factory()->create();

        $this->signIn([
            'company_id' => $company->id,
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item A'
        ]);

        Item::factory()->create([
            'company_id' => $company->id,
            'name' =>  'Item B'
        ]);

        Livewire::test(ItemsList::class)
                ->assertSee('Item A')
                ->assertSee('Item B')
                ->set('search', 'A')
                ->assertSee('Item A')
                ->assertDontSee('Item B');
    }

    /** @test */
    public function a_dashboard_contains_email_item_form_livewire_component()
    {
        $this->signIn();

        $this->get('/items')
             ->assertSeeLivewire('email-item-form');
    }

    /** @test */
    public function a_dashboard_contains_items_list_livewire_component()
    {
        $this->signIn();

        $this->get('/items')
             ->assertSeeLivewire('items-list');
    }

    /** @test
     * @throws \Exception
     */
    public function an_employee_can_view_employee_only_item()
    {
        $company = Company::factory()->create();

        $this->signInAsEmployee([
            'company_id' => $company->id,
        ]);

        $itemEmployeeOnly = Item::factory()->employeeOnly()->create([
            'company_id' => $company->id,
            'is_category' => true,
        ]);

        $itemWithin = Item::factory()->employeeOnly()->create([
            'company_id' => $company->id,
            'parent_id' => $itemEmployeeOnly->id,
        ]);

        Livewire::test(ItemsList::class, ['category' => $itemEmployeeOnly])
            ->assertSeeText($itemWithin->name);
    }

    /** @test
     * @throws \Exception
     */
    public function an_employee_can_view_employee_only_items()
    {
        $company = Company::factory()->create();

        $this->signInAsEmployee([
            'company_id' => $company->id,
        ]);

        /** @var Item $itemForAll */
        $itemForAll = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        $itemEmployeeOnly = Item::factory()->employeeOnly()->create([
            'company_id' => $company->id,
        ]);

        Livewire::test(ItemsList::class)
             ->assertSeeText($itemForAll->name)
             ->assertSeeText($itemEmployeeOnly->name);
    }

    /** @test */
    public function a_regular_user_can_not_view_employee_only_item()
    {
        $company = Company::factory()->create();

        $this->signIn([
            'company_id' => $company->id,
        ]);

        $itemEmployeeOnly = Item::factory()->employeeOnly()->create([
            'company_id' => $company->id,
        ]);

        $this->get($itemEmployeeOnly->path())
             ->assertForbidden();
    }

    /** @test */
    public function a_regular_user_can_not_view_employee_only_items()
    {
        $company = Company::factory()->create();

        $this->signIn([
            'company_id' => $company->id,
        ]);

        $itemForAll = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        $itemEmployeeOnly = Item::factory()->employeeOnly()->create([
            'company_id' => $company->id,
        ]);

        Livewire::test(ItemsList::class)
                ->assertSeeText($itemForAll->name)
                ->assertDontSeeText($itemEmployeeOnly->name);
    }

    /** @test */
    public function a_user_sees_only_items_belonging_to_their_company()
    {
        $companyA = Company::factory()->create();

        $this->signIn([
            'company_id' => $companyA->id,
        ]);

        $itemA = Item::factory()->create([
            'company_id' => $companyA->id,
        ]);

        $companyB = Company::factory()->create();

        $itemB = Item::factory()->create([
            'company_id' => $companyB->id,
        ]);

        $this->get('/items')->assertSeeText($itemA->name);

        Livewire::test(ItemsList::class)
                ->assertSeeText($itemA->name)
                ->assertDontSeeText($itemB->name);
    }
}
