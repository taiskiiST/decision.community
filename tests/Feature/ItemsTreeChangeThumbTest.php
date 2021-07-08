<?php

namespace Tests\Feature;

use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ItemsTreeChangeThumbTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function item_has_to_exist()
    {
        Storage::fake('local');
        $this->mockThumbMaker();
        $image = UploadedFile::fake()->image('photo1.jpg');

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | No id is supplied.
        |--------------------------------------------------------------------------
        */

        $this->post(route('items-tree.update-item-thumb'), [
            'image' => $image,
        ])->assertNotFound();

        // Assert that the thumb has not changed.
        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'thumb' => $item->thumb,
            'company_id' => $user->company_id,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Non-existing id is supplied.
        |--------------------------------------------------------------------------
        */

        $nonExistingItemId = $item->id + 777;

        $this->post(route('items-tree.update-item-thumb'), [
            'id' => $nonExistingItemId,
            'image' => $image,
        ])->assertNotFound();

        // Assert that the thumb has not changed.
        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'thumb' => $item->thumb,
            'company_id' => $user->company_id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function image_parameter_is_required()
    {
        Storage::fake('local');
        $this->mockThumbMaker();
        $image = UploadedFile::fake()->image('photo1.jpg');

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $this->post(route('items-tree.update-item-thumb'), [
            'id' => $item->id,
        ])->assertSessionHasErrors('image');

        // Assert that the thumb has not changed.
        $this->assertDatabaseHas('items', [
            'id' => $item->id,
            'thumb' => $item->thumb,
            'company_id' => $user->company_id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function items_thumb_is_updated()
    {
        Storage::fake('local');
        $this->mockThumbMaker();
        $image = UploadedFile::fake()->image('photo1.jpg');

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $this->post(route('items-tree.update-item-thumb'), [
            'id'   => $item->id,
            'image' => $image,
        ])->assertOk();

        // Assert that the thumb has changed.
        $this->assertDatabaseMissing('items', [
            'id' => $item->id,
            'thumb' => $item->thumb,
            'company_id' => $user->company_id,
        ]);

        $item = Item::first();

        // Assert that the file exists.
        Storage::disk('local')->assertExists($item->thumbPath());
    }
}
