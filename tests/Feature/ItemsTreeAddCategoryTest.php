<?php

namespace Tests\Feature;

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Class ItemsTreeAddCategoryTest
 *
 * @package Tests\Feature
 */
class ItemsTreeAddCategoryTest extends TestCase
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
        $image = UploadedFile::fake()->image('photo1.jpg');
        $this->mockThumbMaker();

        $this->post(route('items-tree.add-category'), [
            'name' => 'New Category',
            'image' => $image,
            'parentId' => $notCategoryParent->id,
        ])->assertJson([
            'errorMessage' => 'Cannot add a category: the destination is not a category'
        ]);

        $this->assertDatabaseMissing('items', [
            'parent_id' => $notCategoryParent->id,
            'company_id' => $user->company_id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_adding_a_category_to_an_employee_only_category_the_resulting_category_is_employee_only()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');
        $image = UploadedFile::fake()->image('photo1.jpg');
        $this->mockThumbMaker();

        $employeeOnlyCategory = Item::factory()->employeeOnly()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        $this->post(route('items-tree.add-category'), [
            'name' => 'New Category',
            'image' => $image,
            'parentId' => $employeeOnlyCategory->id,
        ]);

        $this->assertDatabaseHas('items', [
            'name' => 'New Category',
            'parent_id' => $employeeOnlyCategory->id,
            'employee_only' => true,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_employee_only_parameter_is_present_the_resulting_category_is_employee_only()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');
        $image = UploadedFile::fake()->image('photo1.jpg');
        $this->mockThumbMaker();

        $this->post(route('items-tree.add-category'), [
            'name' => 'New Category',
            'image' => $image,
            'employeeOnly' => 'true',
        ]);

        $this->assertDatabaseHas('items', [
            'name' => 'New Category',
            'employee_only' => true,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function name_is_a_required_parameter()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');
        $image = UploadedFile::fake()->image('photo1.jpg');
        $this->mockThumbMaker();

        $this->post(route('items-tree.add-category'), [
            'image' => $image,
        ])->assertSessionHasErrors('name');

        $this->post(route('items-tree.add-category'), [
            'name' => '',
            'image' => $image,
        ])->assertSessionHasErrors('name');
    }

    /** @test
     * @throws \Exception
     */
    public function image_is_a_required_parameter()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');
        $image = UploadedFile::fake()->image('photo1.jpg');
        $this->mockThumbMaker();

        $this->post(route('items-tree.add-category'), [
            'name' => 'New Category',
        ])->assertSessionHasErrors('image');
    }

    /** @test
     * @throws \Exception
     */
    public function image_should_have_a_proper_format()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');
        $image = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');
        $this->mockThumbMaker();

        $this->post(route('items-tree.add-category'), [
            'name' => 'New Category',
            'image' => $image,
        ])->assertSessionHasErrors('image');
    }

    /** @test
     * @throws \Exception
     */
    public function a_category_is_created_and_thumb_exists_after_adding_a_category()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');
        $image = UploadedFile::fake()->image('photo1.jpg');
        $this->mockThumbMaker();

        $this->withoutExceptionHandling();

        $this->post(route('items-tree.add-category'), [
            'name' => 'New Category',
            'image' => $image,
        ]);

        $this->assertDatabaseHas('items', [
            'name' => 'New Category',
            'is_category' => true,
        ]);

        /** @var Item $newCategory */
        $newCategory = Item::first();

        Storage::disk('local')->assertExists($newCategory->thumbPath());
    }
}
