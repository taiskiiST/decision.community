<?php /** @noinspection PhpUnhandledExceptionInspection */

namespace Tests\Feature;

use App\Http\Livewire\AddPdfForm;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Class DashboardTest
 *
 * @package Tests\Feature
 */
class AddPdfFormTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function when_adding_a_pdf_to_a_regular_category_the_resulting_items_employee_only_should_match_users_input()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        /** @var Item $regularCategory */
        $regularCategory = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->set('parentItemId', $regularCategory->id)
                ->set('employeeOnly', true)
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'parent_id' => $regularCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => true,
        ]);

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->set('parentItemId', $regularCategory->id)
                ->set('employeeOnly', false)
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'parent_id' => $regularCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => false,
        ]);
    }

    /** @test */
    public function when_adding_a_pdf_to_employee_only_category_the_resulting_item_must_be_employee_only()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        /** @var Item $employeeOnlyCategory */
        $employeeOnlyCategory = Item::factory()->employeeOnly()->create([
            'company_id' => $user->company_id,
        ]);

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->set('parentItemId', $employeeOnlyCategory->id)
                ->set('employeeOnly', false)
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'parent_id' => $employeeOnlyCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => true,
        ]);
    }

    /** @test */
    public function an_admin_has_to_be_authenticated_to_add_pdf()
    {
        Livewire::test(AddPdfForm::class)
                ->call('submitForm')
                ->assertUnauthorized();

    }

    /** @test */
    public function a_manager_can_add_pdf()
    {
        $this->signInAsManager();

        Livewire::test(AddPdfForm::class)
                ->call('submitForm')
                ->assertOk();

    }

    /** @test */
    public function a_regular_user_cannot_add_pdf()
    {
        $this->signIn();

        Livewire::test(AddPdfForm::class)
                ->call('submitForm')
                ->assertForbidden();

    }

    /** @test */
    public function a_regular_employee_cannot_add_pdf()
    {
        $this->signInAsEmployee();

        Livewire::test(AddPdfForm::class)
                ->call('submitForm')
                ->assertForbidden();

    }

    /** @test */
    public function file_is_a_required_parameter()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        Storage::fake('local');

        Livewire::test(AddPdfForm::class)
                ->call('submitForm')
                ->assertHasErrors(['file' => 'required']);
    }

    /** @test */
    public function only_pdf_file_type_can_be_uploaded()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        Storage::fake('local');

        $file = UploadedFile::fake()->create('file_with_non_pdf_type');

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->call('submitForm')
                ->assertHasErrors(['file' => 'mimes']);
    }

    /** @test */
    public function an_item_is_created_and_pdf_exists_and_thumb_exists_after_submitting_a_form()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'parent_id' => null,
        ]);

        /** @var Item $item */
        $item = Item::first();

        Storage::disk('local')->assertExists($item->thumbPath());

        Storage::disk('local')->assertExists($item->pdfPath());
    }
}
