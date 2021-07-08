<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Services\ThumbMaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Class ItemsTreeRemoveItemTest
 *
 * @package Tests\Feature
 */
class ItemsTreeRemoveItemTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function id_parameter_is_required()
    {
        $user = $this->signInAsManager();

        $this->delete(route('items-tree.remove-item'))->assertNotFound();
    }

    /** @test
     * @throws \Exception
     */
    public function item_has_to_exist()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $nonExistingId = $item->id + 777;

        $this->delete(route('items-tree.remove-item'), [
            'id' => $nonExistingId,
        ])->assertNotFound();
    }

    /** @test
     * @throws \Exception
     */
    public function item_is_deleted_from_database()
    {
        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertOk();

        $this->assertDatabaseMissing('items', [
            'id' => $item->id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function all_children_of_a_category_are_deleted_from_database()
    {
        $user = $this->signInAsManager();

        /** @var Item $category */
        $category = Item::factory()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        $children = Item::factory()->count(5)->create([
            'parent_id' => $category->id
        ]);

        $this->delete(route('items-tree.remove-item'), [
            'id' => $category->id,
        ])->assertOk();

        $this->assertDatabaseMissing('items', [
            'id' => $category->id,
        ]);

        foreach ($children as $child) {
            $this->assertDatabaseMissing('items', [
                'id' => $child->id,
            ]);
        }
    }

    /** @test
     * @throws \Exception
     */
    public function items_thumb_is_deleted_from_filesystem()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        // Let's first make an item.
        $this->mockThumbMaker();

        $this->mockYoutube();

        $this->post(route('items-tree.add-youtube-item'), [
            'url' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        $this->assertDatabaseHas('items', [
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'parent_id' => null,
        ]);

        /** @var Item $item */
        $item = Item::first();

        Storage::disk('local')->assertExists($item->thumbPath());

        // Now let's delete it.
        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertOk();

        Storage::disk('local')->assertMissing($item->thumbPath());
    }

    /** @test
     * @throws \Exception
     */
    public function thumbs_and_pdf_sources_of_children_are_deleted_from_filesystem()
    {
        $user = $this->signInAsManager();

        /** @var Item $category */
        $category = Item::factory()->create([
            'name' => 'Main Category',
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        Storage::fake('local');

        // Let's first make children.
        $this->mockThumbMaker();

        $childrenCount = 3;

        for ($i = 0; $i < $childrenCount; ++$i) {
            $file = UploadedFile::fake()->create("Cool Report {$i}.pdf", 100 * ($i + 1), 'application/pdf');

            $this->post(route('items-tree.add-pdf-item'), [
                'parentId' => $category->id,
                'file' => $file
            ]);
        }

        /** @var Item $subCategory */
        $subCategory = Item::factory()->create([
            'name' => 'Sub Category',
            'company_id' => $user->company_id,
            'parent_id' => $category->id,
            'is_category' => true,
        ]);

        $subCategoryChildrenCount = 6;

        for ($i = 0; $i < $subCategoryChildrenCount; ++$i) {
            $file = UploadedFile::fake()->create("Cool Sub Report {$i}.pdf", 100 * ($i + 1), 'application/pdf');

            $this->post(route('items-tree.add-pdf-item'), [
                'parentId' => $subCategory->id,
                'file' => $file
            ]);
        }

        $this->assertDatabaseCount('items', $childrenCount + 1 + $subCategoryChildrenCount + 1);

        $children = $category->getAllChildren();
        $this->assertCount($childrenCount + $subCategoryChildrenCount + 1, $children);

        /** @var Item $child */
        foreach ($children as $child) {
            if (! $child->isCategory()) {
                Storage::disk('local')->assertExists($child->thumbPath());
                Storage::disk('local')->assertExists($child->pdfPath());
            }
        }

        // Now let's delete the parent.
        $this->delete(route('items-tree.remove-item'), [
            'id' => $category->id,
        ])->assertOk();

        $this->assertDatabaseCount('items', 0);
        foreach ($children as $child) {
            Storage::disk('local')->assertMissing($child->thumbPath());
            Storage::disk('local')->assertMissing($child->pdfPath());
        }
    }

    /** @test
     * @throws \Exception
     */
    public function when_item_is_pdf_then_pdf_source_is_deleted_from_filesystem()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        // Let's first make an item.
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

        Storage::disk('local')->assertExists($item->pdfPath());

        // Now let's delete it.
        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertOk();

        Storage::disk('local')->assertMissing($item->pdfPath());
    }
}
