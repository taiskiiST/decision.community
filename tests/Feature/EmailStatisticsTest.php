<?php

namespace Tests\Feature;

use App\Console\Commands\EmailStatistics;
use App\Mail\Statistics;
use App\Models\Company;
use App\Models\Item;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailStatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function emails_to_managers_and_employees_are_sent()
    {
        Mail::fake();

        $company = Company::factory()->create();

        $managerA = $this->signInAsManager([
            'name' => 'Manager A',
            'company_id' => $company->id,
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

        $itemA = Item::factory()->create([
            'company_id' => $managerA->company_id,
        ]);

        $itemA->addVisit($growerOfManagerA);

        $itemA->addVisit($employeeOfManagerA);

        $this->mockGateApiEmployeeGrowersAndManagerSalespeople([[
            'id' => $growerOfManagerA->gate_user_id,
            'email' => $growerOfManagerA->email
        ]], [[
            'id' => $employeeOfManagerA->gate_user_id,
            'email' => $employeeOfManagerA->email
        ]]);

        $this->artisan(EmailStatistics::class)
             ->assertExitCode(0);

        // Assert that a mailable was sent...
        Mail::assertSent(function (Statistics $mail) use ($managerA) {
            return $mail->hasTo($managerA->email);
        });

        // Assert that a mailable was sent...
        Mail::assertSent(function (Statistics $mail) use ($employeeOfManagerA) {
            return $mail->hasTo($employeeOfManagerA->email);
        });
    }
}
