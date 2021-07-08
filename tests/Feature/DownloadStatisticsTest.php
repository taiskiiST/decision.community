<?php

namespace Tests\Feature;

use App\Exports\ItemVisitsExport;
use App\Models\Permission;
use App\Models\Item;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Maatwebsite\Excel\Facades\Excel;
use Tests\TestCase;

/**
 * Class DownloadStatisticsTest
 *
 * @package Tests\Feature
 */
class DownloadStatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function start_and_end_dates_are_required_parameters()
    {
        $this->signInAsManager();

        $this->get(route('statistics.download'))
             ->assertSessionHasErrors(['startDate', 'endDate']);
    }

    /** @test
     * @throws \Exception
     */
    public function statistics_can_be_downloaded_only_by_managers_and_employees()
    {
        $user = $this->signInAsManager();

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([], []);

        $this->call('GET', route('statistics.download'), [
            'startDate' => now()->subWeek()->toDateString(),
            'endDate' => now()->toDateString(),
        ])->assertStatus(200);

        Permission::withdrawPermission($user, Permission::VIEW_EMPLOYEE_ITEMS);
        Permission::withdrawPermission($user, Permission::MANAGE_ITEMS);

        $this->get(route('statistics.download'))
                ->assertStatus(403);

        $user = $this->signIn();

        $this->get(route('statistics.download'))
                ->assertStatus(403);

        $user = $this->signInAsEmployee();

        $this->call('GET', route('statistics.download'), [
            'startDate' => now()->subWeek()->toDateString(),
            'endDate' => now()->toDateString(),
        ])->assertStatus(200);
    }

    /** @test
     * @throws \Exception
     */
    public function statistics_is_downloaded_with_right_data_inside()
    {
        Excel::fake();

        $admin = $this->signInAsManager();

        $regularUser = User::factory()->create([
            'company_id' => $admin->company_id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $admin->company_id,
        ]);

        $item->addVisit($regularUser);
        $item->addVisit($regularUser);
        $item->addVisit($regularUser);

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $regularUser->gate_user_id,
            'email' => $regularUser->email
        ]], []);

        $this->call('GET', route('statistics.download'), [
            'startDate' => now()->subWeek()->toDateString(),
            'endDate' => now()->toDateString(),
        ])->assertStatus(200);

        Excel::assertDownloaded('statistics.xlsx', function(ItemVisitsExport $export) use ($item) {
            // Assert that the correct export is downloaded.
            return $export->query()->get()->first()->itemName === $item->name;
        });

    }
}
