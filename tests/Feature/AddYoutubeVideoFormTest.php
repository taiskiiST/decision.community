<?php /** @noinspection PhpUnhandledExceptionInspection */

namespace Tests\Feature;

use App\Http\Livewire\AddYoutubeVideoForm;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Class DashboardTest
 *
 * @package Tests\Feature
 */
class AddYoutubeVideoFormTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function when_adding_a_youtube_video_to_a_regular_category_the_resulting_items_employee_only_should_match_users_input()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        /** @var Item $regularCategory */
        $regularCategory = Item::factory()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        Storage::fake('local');

        $this->mockThumbMaker();

        $this->mockYoutube();

        Livewire::test(AddYoutubeVideoForm::class)
                ->set('parentItemId', $regularCategory->id)
                ->set('employeeOnly', true)
                ->set('url', 'https://www.youtube.com/watch?v=haKKtOHs-XM')
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'parent_id' => $regularCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'employee_only' => true,
        ]);

        Livewire::test(AddYoutubeVideoForm::class)
                ->set('parentItemId', $regularCategory->id)
                ->set('employeeOnly', false)
                ->set('url', 'https://www.youtube.com/watch?v=haKKtOHs-XM')
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'parent_id' => $regularCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'employee_only' => false,
        ]);
    }

    /** @test */
    public function when_adding_a_youtube_video_to_employee_only_category_the_resulting_item_must_be_employee_only()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        /** @var Item $employeeOnlyCategory */
        $employeeOnlyCategory = Item::factory()->employeeOnly()->create([
            'company_id' => $user->company_id,
            'is_category' => true,
        ]);

        Storage::fake('local');

        $this->mockThumbMaker();

        $this->mockYoutube();

        Livewire::test(AddYoutubeVideoForm::class)
                ->set('parentItemId', $employeeOnlyCategory->id)
                ->set('employeeOnly', false)
                ->set('url', 'https://www.youtube.com/watch?v=haKKtOHs-XM')
                ->call('submitForm');

        $this->assertDatabaseHas('items', [
            'parent_id' => $employeeOnlyCategory->id,
            'company_id' => $user->company_id,
            'name' => 'Start Your Ag Career as a Co-Alliance Field Scout',
            'employee_only' => true,
        ]);
    }

    /** @test */
    public function an_admin_has_to_be_authenticated_to_add_a_youtube_video()
    {
        Livewire::test(AddYoutubeVideoForm::class)
                ->call('submitForm')
                ->assertUnauthorized();

    }

    /** @test */
    public function a_manager_can_add_a_youtube_video()
    {
        $this->signInAsManager();

        Livewire::test(AddYoutubeVideoForm::class)
                ->call('submitForm')
                ->assertOk();

    }

    /** @test */
    public function a_regular_user_cannot_add_a_youtube_video()
    {
        $this->signIn();

        Livewire::test(AddYoutubeVideoForm::class)
                ->call('submitForm')
                ->assertForbidden();

    }

    /** @test */
    public function a_regular_employee_cannot_add_a_youtube_video()
    {
        $this->signInAsEmployee();

        Livewire::test(AddYoutubeVideoForm::class)
                ->call('submitForm')
                ->assertForbidden();

    }

    /** @test */
    public function url_is_a_required_parameter()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        Storage::fake('local');

        Livewire::test(AddYoutubeVideoForm::class)
                ->call('submitForm')
                ->assertHasErrors(['url' => 'required']);
    }

    /** @test */
    public function url_should_have_a_proper_format()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        Storage::fake('local');

        Livewire::test(AddYoutubeVideoForm::class)
                ->set('url', 'just_a_string_not_a_url')
                ->call('submitForm')
                ->assertHasErrors(['url' => 'url']);
    }

    /** @test */
    public function an_item_is_created_and_thumb_exists_after_submitting_a_form()
    {
        $user = $this->signInAsManager();

        $this->get('/items')->assertOk();

        Storage::fake('local');

        $this->mockThumbMaker();

        $this->mockYoutube();

        Livewire::test(AddYoutubeVideoForm::class)
                ->set('url', 'https://www.youtube.com/watch?v=haKKtOHs-XM')
                ->call('submitForm');

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
