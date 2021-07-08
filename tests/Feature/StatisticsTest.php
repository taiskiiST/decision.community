<?php

namespace Tests\Feature;

use App\Http\Livewire\AddPdfForm;
use App\Http\Livewire\ItemsList;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Class StatisticsTest
 *
 * @package Tests\Feature
 */
class StatisticsTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function when_an_item_is_deleted_its_visiting_records_are_also_deleted()
    {
        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'source' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        Livewire::test(ItemsList::class)
                ->assertSee($item->name)
                ->call('itemClicked', $item->id);

        $this->assertDatabaseHas('item_visits', [
            'item_id' => $item->id,
            'user_id' => $user->id,
            'time' => now()
        ]);

        // Delete the item.
        $item->delete();

        $this->assertDatabaseCount('item_visits', 0);
    }

    /** @test
     * @throws \Exception
     */
    public function when_a_user_is_deleted_its_visiting_records_are_also_deleted()
    {
        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'source' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        Livewire::test(ItemsList::class)
                ->assertSee($item->name)
                ->call('itemClicked', $item->id);

        $this->assertDatabaseHas('item_visits', [
            'item_id' => $item->id,
            'user_id' => $user->id,
            'time' => now()
        ]);

        // Delete a user.
        $user->delete();

        $this->assertDatabaseCount('item_visits', 0);
    }

    /** @test
     * @throws \Exception
     */
    public function when_a_user_downloads_a_pdf_this_action_is_recorded()
    {
        $user = $this->signInAsManager();

        Storage::fake('local');

        // Let's first make an item.
        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->mockThumbMaker();

        Livewire::test(AddPdfForm::class)
                ->set('file', $file)
                ->call('submitForm');;

        $this->assertDatabaseHas('items', [
            'company_id' => $user->company_id,
            'name' => 'Cool Report',
        ]);

        /** @var Item $item */
        $pdfItem = Item::first();

        Storage::disk('local')->assertExists($pdfItem->pdfPath());

        // Sign in as a regular user.
        $regularUser = $this->signIn([
            'company_id' => $pdfItem->company_id,
        ]);

        $this->get($pdfItem->path() . '/download')
             ->assertOk();

        $this->assertDatabaseHas('item_visits', [
            'item_id' => $pdfItem->id,
            'user_id' => $regularUser->id,
            'time' => now(),
        ]);

        $this->get($pdfItem->path() . '/download')
             ->assertOk();

        $this->assertDatabaseCount('item_visits', 2);

        $this->get($pdfItem->path() . '/download')
             ->assertOk();

        $this->assertDatabaseCount('item_visits', 3);

        // Sign in as a regular user.
        $anotherUser = $this->signIn([
            'company_id' => $pdfItem->company_id,
        ]);

        $this->get($pdfItem->path() . '/download')
             ->assertOk();

        $this->assertDatabaseHas('item_visits', [
            'item_id' => $pdfItem->id,
            'user_id' => $anotherUser->id,
            'time' => now(),
        ]);
    }

    /** @test */
    public function when_a_user_clicks_on_youtube_video_this_action_is_recorded()
    {
        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'source' => 'https://www.youtube.com/watch?v=haKKtOHs-XM'
        ]);

        Livewire::test(ItemsList::class)
                ->assertSee($item->name)
                ->call('itemClicked', $item->id);

        $this->assertDatabaseHas('item_visits', [
            'item_id' => $item->id,
            'user_id' => $user->id,
            'time' => now()
        ]);

        Livewire::test(ItemsList::class)
                ->call('itemClicked', $item->id);

        $this->assertDatabaseCount('item_visits', 2);
    }

    /** @test */
    public function when_a_user_opens_a_category_this_action_is_recorded()
    {
        // Sign in as a regular user.
        $user = $this->signIn();

        $item = Item::factory()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        $this->get($item->path())
             ->assertOk();

        $this->assertDatabaseHas('item_visits', [
            'item_id' => $item->id,
            'user_id' => $user->id,
            'time' => now()
        ]);

        $this->get($item->path())
             ->assertOk();

        $this->assertDatabaseCount('item_visits', 2);
    }
}
