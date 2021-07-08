<?php

namespace Tests\Feature;

use App\Models\Item;
use App\Services\ThumbMaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Class ItemsTreeAddYoutubeItemTest
 *
 * @package Tests\Feature
 */
class ItemsTreeAddYoutubeItemTest extends TestCase
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

        $this->mockThumbMaker();

        $this->mockYoutube();

        $this->post(route('items-tree.add-youtube-item'), [
            'parentId' => $notCategoryParent->id,
            'url' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ])->assertJson([
            'errorMessage' => 'Cannot add an item: the destination is not a category'
        ]);

        $this->assertDatabaseMissing('items', [
            'parent_id' => $notCategoryParent->id,
            'company_id' => $user->company_id,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_adding_a_youtube_video_to_the_first_level_the_resulting_items_employee_only_should_be_false()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $this->mockThumbMaker();

        $this->mockYoutube();

        $this->post(route('items-tree.add-youtube-item'), [
            'url' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        $this->assertDatabaseHas('items', [
            'parent_id' => null,
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'employee_only' => false,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function when_adding_a_youtube_video_to_a_category_the_resulting_items_employee_only_status_must_be_taken_from_its_parent()
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

        $this->mockThumbMaker();

        $this->mockYoutube();

        $this->post(route('items-tree.add-youtube-item'), [
            'parentId' => $employeeOnlyCategory->id,
            'url' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        $this->assertDatabaseHas('items', [
            'parent_id' => $employeeOnlyCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
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

        $this->post(route('items-tree.add-youtube-item'), [
            'parentId' => $nonEmployeeOnlyCategory->id,
            'url' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        $this->assertDatabaseHas('items', [
            'parent_id' => $nonEmployeeOnlyCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'employee_only' => false,
        ]);
    }

    /** @test
     * @throws \Exception
     */
    public function url_is_a_required_parameter()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $this->post(route('items-tree.add-youtube-item'))->assertSessionHasErrors('url');
    }

    /** @test
     * @throws \Exception
     */
    public function url_should_have_a_proper_format()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        $this->post(route('items-tree.add-youtube-item'), [
            'url' => 'just_a_string_not_a_url'
        ])->assertSessionHasErrors('url');
    }

    /** @test
     * @throws \Exception
     */
    public function an_item_is_created_and_thumb_exists_after_adding_a_video()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

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
    }
}
