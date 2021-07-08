<?php

namespace Tests\Feature;

use App\Http\Livewire\AddPdfForm;
use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

class DownloadPdfItemTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function if_pdf_file_does_not_exist_not_found_is_returned()
    {
        $user = $this->signIn();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'source' => null,
        ]);

        $this->get($item->path() . '/download')
             ->assertNotFound();
    }

    /** @test */
    public function if_item_is_not_of_pdf_type_not_found_is_returned()
    {
        $user = $this->signIn();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'source' => 'https://www.youtube.com/watch?v=haKKtOHs-XM',
        ]);

        $this->get($item->path() . '/download')
             ->assertNotFound();
    }

    /** @test */
    public function a_user_cannot_download_an_item_of_the_other_company()
    {
        /** @var Company $firstCompany */
        $firstCompany = Company::factory()->create();

        $this->signIn([
            'company_id' => $firstCompany->id,
        ]);

        /** @var Company $someOtherCompany */
        $someOtherCompany = Company::factory()->create();

        /** @var Item $employeeOnlyItem */
        $employeeOnlyItem = Item::factory()->create([
            'company_id' => $someOtherCompany->id,
            'source' => 'some.pdf',
        ]);

        $this->get($employeeOnlyItem->path() . '/download')
             ->assertForbidden();
    }

    /** @test
     * @throws \Exception
     */
    public function only_an_employee_can_download_employee_only_pdf_items()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        // Let's first make an item.
        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->set('employeeOnly', true)
                ->call('submitForm');;

        $this->assertDatabaseHas('items', [
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => true,
        ]);

        /** @var Item $item */
        $employeeOnlyItem = Item::first();

        Storage::disk('local')->assertExists($employeeOnlyItem->pdfPath());

        // Sign in as a regular user.
        $this->signIn([
            'company_id' => $employeeOnlyItem->company_id,
        ]);

        $this->get($employeeOnlyItem->path() . '/download')
            ->assertForbidden();

        // Sign in as employee.
        $this->signInAsEmployee([
            'company_id' => $employeeOnlyItem->company_id,
        ]);

        $this->get($employeeOnlyItem->path() . '/download')
             ->assertOk();
    }
}
