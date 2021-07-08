<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Services\ThumbMaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Class ItemsTreeAddPdfItemTest
 *
 * @package Tests\Feature
 */
class ItemsTreeAddPdfItemTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function if_parent_is_present_it_has_to_be_a_category()
    {
        $user = $this->signInAsManager();

        /** @var Item $notCategoryParent */
        $notCategoryParent = Item::factory()->create([
            'company_id' => $user->company_id,
            'is_category' => false,
        ]);

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        $this->post(route('items-tree.add-pdf-item'), [
            'parentId' => $notCategoryParent->id,
            'file' => $file,
        ])->assertJson([
            'errorMessage' => 'Cannot add an item: the destination is not a category'
        ]);

        $this->assertDatabaseMissing('items', [
            'parent_id' => $notCategoryParent->id,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_adding_a_pdf_to_the_first_level_the_resulting_items_employee_only_should_be_false()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        $this->post(route('items-tree.add-pdf-item'), [
            'file' => $file,
        ]);

        $this->assertDatabaseHas('items', [
            'parent_id' => null,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => false,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_adding_a_pdf_to_a_category_the_resulting_items_employee_only_status_must_be_taken_from_its_parent()
    {
        $user = $this->signInAsManager();

        /*
        |--------------------------------------------------------------------------
        | Employee-only category.
        |--------------------------------------------------------------------------
        */

        /** @var Item $employeeOnlyCategory */
        $employeeOnlyCategory = Item::factory()->employeeOnly()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        $this->post(route('items-tree.add-pdf-item'), [
            'parentId' => $employeeOnlyCategory->id,
            'file' => $file,
        ]);

        $this->assertDatabaseHas('items', [
            'parent_id' => $employeeOnlyCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => true,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Non-employee-only category.
        |--------------------------------------------------------------------------
        */

        /** @var Item $nonEmployeeOnlyCategory */
        $nonEmployeeOnlyCategory = Item::factory()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        $this->post(route('items-tree.add-pdf-item'), [
            'parentId' => $nonEmployeeOnlyCategory->id,
            'file' => $file,
        ]);

        $this->assertDatabaseHas('items', [
            'parent_id' => $nonEmployeeOnlyCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
            'employee_only' => false,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function file_is_a_required_parameter()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $this->post(route('items-tree.add-pdf-item'))->assertSessionHasErrors('file');
    }

    /** @test
     * @throws \Exception
     */
    public function only_pdf_file_type_can_be_uploaded()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $file = UploadedFile::fake()->create('file_with_non_pdf_type');

        $r = $this->post(route('items-tree.add-pdf-item'), [
            'file' => $file
        ])->assertSessionHasErrors(['file' => 'The file must be a file of type: pdf.']);
    }

    /** @test
     * @throws \Exception
     */
    public function an_item_is_created_and_pdf_exists_and_thumb_exists_after_adding_a_pdf()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        $this->post(route('items-tree.add-pdf-item'), [
            'file' => $file
        ]);

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
