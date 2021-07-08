<?php

namespace Tests\Feature;

use App\Http\Livewire\StatisticsTable;
use App\Models\Company;
use App\Models\Permission;
use App\Models\User;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Class ViewStatisticsTest
 *
 * @package Tests\Feature
 */
class ViewStatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function managers_should_see_statistics_generated_by_their_salespeople()
    {
        $company = Company::factory()->create();

        $managerA = $this->signInAsManager([
            'name' => 'Manager A',
            'company_id' => $company->id,
        ]);

        $managerB = User::factory()->create([
            'company_id' => $managerA->company_id,
            'name' => 'Manager B',
            'permissions' => Permission::ACCESS . ',' . Permission::VIEW_EMPLOYEE_ITEMS . ',' . Permission::MANAGE_ITEMS
        ]);

        $growerOfManagerA = User::factory()->create([
            'company_id' => $managerA->company_id,
            'name' => 'Grower of A',
        ]);

        $employeeOfManagerA = User::factory()->create([
            'company_id' => $managerA->company_id,
            'name' => 'Employee of A',
            'permissions' => Permission::ACCESS . ',' . Permission::VIEW_EMPLOYEE_ITEMS
        ]);

        $employeeOfManagerB = User::factory()->create([
            'company_id' => $managerB->company_id,
            'name' => 'Employee of B',
            'permissions' => Permission::ACCESS . ',' . Permission::VIEW_EMPLOYEE_ITEMS
        ]);

        $itemA = Item::factory()->create([
            'company_id' => $managerA->company_id,
        ]);

        $itemB = Item::factory()->create([
            'company_id' => $managerA->company_id,
        ]);

        $itemA->addVisit($growerOfManagerA);

        $itemA->addVisit($employeeOfManagerA);
        $itemA->addVisit($employeeOfManagerA);
        $itemA->addVisit($employeeOfManagerA);

        $itemB->addVisit($employeeOfManagerB);
        $itemB->addVisit($employeeOfManagerB);

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $growerOfManagerA->gate_user_id,
            'email' => $growerOfManagerA->email
        ]], [[
            'id' => $employeeOfManagerA->gate_user_id,
            'email' => $employeeOfManagerA->email
        ]]);

        Livewire::test(StatisticsTable::class)
                ->assertSee($growerOfManagerA->email)
                ->assertSee($growerOfManagerA->name)
                ->assertSee($employeeOfManagerA->email)
                ->assertSee($employeeOfManagerA->name)
                ->assertSee($itemA->name)
                ->assertDontSee($employeeOfManagerB->email)
                ->assertDontSee($employeeOfManagerB->name)
                ->assertDontSee($itemB->name);
    }

    /** @test
     * @throws \Exception
     */
    public function admins_should_see_all_statistics_generated_by_their_company()
    {
        $companyA = Company::factory()->create();

        $employeeOfA = $this->signInAsEmployee([
            'name' => 'Employee',
            'company_id' => $companyA->id,
        ]);

        $itemOfA = Item::factory()->create([
            'company_id' => $companyA->id,
            'name' => 'Cool Item A',
        ]);

        $itemOfA->addVisit($employeeOfA);
        $itemOfA->addVisit($employeeOfA);

        $regularUserOfA = User::factory()->create([
            'company_id' => $companyA->id,
            'name' => 'Regular User',
        ]);

        $itemOfA->addVisit($regularUserOfA);

        $managerOfA = $this->signInAsManager([
            'name' => 'Good Manager',
            'company_id' => $companyA->id,
        ]);

        $itemOfA->addVisit($managerOfA);

        // Company B.
        $companyB = Company::factory()->create();

        $employeeOfB = $this->signInAsEmployee([
            'name' => 'Ivanov Sergei',
            'company_id' => $companyB->id,
        ]);

        $itemOfB = Item::factory()->create([
            'company_id' => $companyB->id,
            'name' => 'Title of Item B',
        ]);

        $itemOfB->addVisit($employeeOfB);
        $itemOfB->addVisit($employeeOfB);

        $regularUserOfB = User::factory()->create([
            'company_id' => $companyB->id,
            'name' => 'Michael Jordan',
        ]);

        $itemOfB->addVisit($regularUserOfB);

        $managerOfB = $this->signInAsManager([
            'name' => 'Bill Gates',
            'company_id' => $companyB->id,
        ]);

        $itemOfB->addVisit($managerOfB);

        // Checking.
        $this->signInAsAdmin([
            'name' => 'Manager',
            'company_id' => $companyA->id,
        ]);

        $this->withoutExceptionHandling();

        Livewire::test(StatisticsTable::class)
                ->assertSee($regularUserOfA->email)
                ->assertSee($regularUserOfA->name)
                ->assertSee($itemOfA->name)
                ->assertSee($employeeOfA->email)
                ->assertSee($employeeOfA->name)
                ->assertSee($managerOfA->email)
                ->assertSee($managerOfA->name)
                ->assertDontSee($regularUserOfB->email)
                ->assertDontSee($regularUserOfB->name)
                ->assertDontSee($itemOfB->name)
                ->assertDontSee($employeeOfB->email)
                ->assertDontSee($employeeOfB->name)
                ->assertDontSee($managerOfB->email)
                ->assertDontSee($managerOfB->name);
    }

    /** @test
     * @throws \Exception
     */
    public function employees_should_not_see_statistics_generated_by_employees_or_managers()
    {
        $company = Company::factory()->create();

        $employeeA = $this->signInAsEmployee([
            'name' => 'Employee A',
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        $item->addVisit($employeeA);
        $item->addVisit($employeeA);

        $regularUser = User::factory()->create([
            'company_id' => $company->id,
            'name' => 'Regular User',
        ]);

        $item->addVisit($regularUser);

        $this->signInAsEmployee([
            'name' => 'Employee B',
            'company_id' => $company->id,
        ]);

        $this->mockGateApiEmployeeGrowers([[
            'id' => $regularUser->gate_user_id,
            'email' => $regularUser->email
        ]]);

        Livewire::test(StatisticsTable::class)
                ->assertSee($regularUser->email)
                ->assertSee($regularUser->name)
                ->assertSee($item->name)
                ->assertDontSee($employeeA->email)
                ->assertDontSee($employeeA->name);
    }

    /** @test
     * @throws \Exception
     */
    public function employees_should_only_see_statistics_generated_by_their_growers()
    {
        $company = Company::factory()->create();

        $employeeA = $this->signInAsEmployee([
            'name' => 'Employee A',
            'company_id' => $company->id,
        ]);

        $employeeB = User::factory()->create([
            'company_id' => $employeeA->company_id,
            'name' => 'Employee B',
            'permissions' => Permission::ACCESS . ',' . Permission::VIEW_EMPLOYEE_ITEMS
        ]);

        $growerOfEmployeeA = User::factory()->create([
            'company_id' => $employeeA->company_id,
            'name' => 'Grower of A',
        ]);

        $growerOfEmployeeB = User::factory()->create([
            'company_id' => $employeeB->company_id,
            'name' => 'Grower of B',
        ]);

        $itemA = Item::factory()->create([
            'company_id' => $employeeA->company_id,
        ]);

        $itemB = Item::factory()->create([
            'company_id' => $employeeA->company_id,
        ]);

        $itemA->addVisit($growerOfEmployeeA);
        $itemA->addVisit($growerOfEmployeeA);
        $itemA->addVisit($growerOfEmployeeA);

        $itemB->addVisit($growerOfEmployeeB);
        $itemB->addVisit($growerOfEmployeeB);

        $this->mockGateApiEmployeeGrowers([[
            'id' => $growerOfEmployeeA->gate_user_id,
            'email' => $growerOfEmployeeA->email
        ]]);

        Livewire::test(StatisticsTable::class)
                ->assertSee($growerOfEmployeeA->email)
                ->assertSee($growerOfEmployeeA->name)
                ->assertSee($itemA->name)
                ->assertDontSee($growerOfEmployeeB->email)
                ->assertDontSee($growerOfEmployeeB->name)
                ->assertDontSee($itemB->name);
    }

    /** @test
     * @throws \Exception
     */
    public function the_end_date_filter_works_correctly()
    {
        $admin = $this->signInAsManager();

        $item = Item::factory()->create([
            'company_id' => $admin->company_id,
        ]);

        $this->travel(2)->days();

        $regularUser = User::factory()->create([
            'company_id' => $admin->company_id,
            'name' => 'Regular User',
        ]);

        $item->addVisit($regularUser);
        $item->addVisit($regularUser);

        $this->travelBack();

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $regularUser->gate_user_id,
            'email' => $regularUser->email
        ]], []);

        Livewire::test(StatisticsTable::class)
                ->assertDontSeeHtml('<div class="text-sm leading-5 text-gray-900">2</div>')
                ->set('endDate', now()->addDays(2))
                ->assertSeeHtml('<div class="text-sm leading-5 text-gray-900">2</div>');
    }

    /** @test
     * @throws \Exception
     */
    public function the_start_date_filter_works_correctly()
    {
        $admin = $this->signInAsManager();

        $this->travel(-8)->days();

        $item = Item::factory()->create([
            'company_id' => $admin->company_id,
        ]);

        $regularUser = User::factory()->create([
            'company_id' => $admin->company_id,
            'name' => 'Regular User',
        ]);

        $item->addVisit($regularUser);
        $item->addVisit($regularUser);

        // Return back to the present time...
        $this->travelBack();

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $regularUser->gate_user_id,
            'email' => $regularUser->email
        ]], []);

        Livewire::test(StatisticsTable::class)
                ->assertDontSeeHtml('<div class="text-sm leading-5 text-gray-900">2</div>')
                ->set('startDate', now()->subDays(8))
                ->assertSeeHtml('<div class="text-sm leading-5 text-gray-900">2</div>');
    }

    /** @test
     * @throws \Exception
     */
    public function the_date_filters_are_set_to_the_last_week_by_default()
    {
        $this->signInAsManager();

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([], []);

        Livewire::test(StatisticsTable::class)
                ->assertSet('startDate', now()->subWeek()->toDateString())
                ->assertSet('endDate', now()->toDateString());
    }

    /** @test
     * @throws \Exception
     */
    public function statistics_tab_contains_statistics_table_livewire_component()
    {
        $this->signInAsManager();

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([], []);

        $this->get(route('statistics.index'))
             ->assertSeeLivewire('statistics-table');
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_managers_and_employees_can_view_statistics()
    {
        $this->get(route('statistics.index'))
             ->assertRedirect('/login');

        $this->signIn();

        $this->get(route('statistics.index'))
             ->assertForbidden();

        $this->signInAsEmployee();

        $this->mockGateApiEmployeeGrowers([]);

        $this->get(route('statistics.index'))
             ->assertOk();

        $this->signInAsManager();

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([], []);

        $this->get(route('statistics.index'))
             ->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function users_can_only_view_statistics_of_items_that_belong_to_their_company()
    {
        $companyA = Company::factory()->create();

        $companyB = Company::factory()->create();

        $regularUserA = User::factory()->create([
            'company_id' => $companyA->id,
        ]);

        $itemA = Item::factory()->create([
            'company_id' => $companyA->id,
        ]);

        $itemA->addVisit($regularUserA);

        $this->signInAsManager([
            'company_id' => $companyB->id,
        ]);

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $regularUserA->gate_user_id,
            'email' => $regularUserA->email
        ]], []);

        $this->get(route('statistics.index'))
             ->assertDontSeeText($regularUserA->name)
             ->assertDontSeeText($regularUserA->email)
             ->assertDontSeeText($itemA->name);

    }

    /** @test
     * @throws \Exception
     */
    public function statistics_is_shown()
    {
        $admin = $this->signInAsManager();

        $regularUser = User::factory()->create([
            'company_id' => $admin->company_id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $admin->company_id,
        ]);

        $item->addVisit($admin);
        $item->addVisit($admin);
        $item->addVisit($regularUser);
        $item->addVisit($regularUser);
        $item->addVisit($regularUser);

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $regularUser->gate_user_id,
            'email' => $regularUser->email
        ]], []);

        $this->get(route('statistics.index'))
             ->assertSee($admin->name)
             ->assertSee($admin->email)
             ->assertSee($item->name)
             ->assertSee($regularUser->name)
             ->assertSee($regularUser->email);

    }
}
