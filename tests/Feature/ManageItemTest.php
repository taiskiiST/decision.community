<?php

namespace Tests\Feature;

use App\Http\Livewire\ItemsList;
use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class ManageItemTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function add_new_item_button_and_menu_is_available_to_managers()
    {
        $this->signInAsManager();

        $this->get('/items')->assertSee('new-item-menu');
    }

    /** @test */
    public function add_new_item_button_and_menu_is_not_available_to_regular_users()
    {
        $this->signIn();

        $this->get('/items')->assertDontSee('new-item-menu');
    }

    /** @test */
    public function add_new_item_button_and_menu_is_not_available_to_regular_employees()
    {
        $this->signInAsEmployee();

        $this->get('/items')->assertDontSee('new-item-menu');
    }

    /** @test
     * @throws \Exception
     */
    public function add_pdf_form_is_available_to_managers()
    {
        $this->signInAsManager();

        Livewire::test(ItemsList::class)
                ->set('isManageItemsModalOpen', true)
                ->set('itemTypeBeingAdded', Item::TYPE_PDF)
                ->assertSeeLivewire('add-pdf-form');
    }

    /** @test
     * @throws \Exception
     */
    public function add_youtube_video_form_is_available_to_managers()
    {
        $this->signInAsManager();

        Livewire::test(ItemsList::class)
                ->set('isManageItemsModalOpen', true)
                ->set('itemTypeBeingAdded', Item::TYPE_YOUTUBE_VIDEO)
                ->assertSeeLivewire('add-youtube-video-form');
    }

    /** @test
     * @throws \Exception
     */
    public function add_pdf_form_is_not_available_to_regular_employees()
    {
        $this->signInAsEmployee();

        Livewire::test(ItemsList::class)
                ->set('isManageItemsModalOpen', true)
                ->set('itemTypeBeingAdded', Item::TYPE_PDF)
                ->assertDontSee('Add a new PDF document');
    }

    /** @test
     * @throws \Exception
     */
    public function add_youtube_video_form_is_not_available_to_regular_employees()
    {
        $this->signInAsEmployee();

        Livewire::test(ItemsList::class)
                ->set('isManageItemsModalOpen', true)
                ->set('itemTypeBeingAdded', Item::TYPE_YOUTUBE_VIDEO)
                ->assertDontSee('Add a new YouTube video');
    }

    /** @test */
    public function add_pdf_form_is_not_available_to_regular_users()
    {
        $this->signIn();

        Livewire::test(ItemsList::class)
                ->set('isManageItemsModalOpen', true)
                ->set('itemTypeBeingAdded', Item::TYPE_PDF)
                ->assertDontSee('Add a new PDF document');
    }

    /** @test */
    public function add_youtube_video_form_is_not_available_to_regular_users()
    {
        $this->signIn();

        Livewire::test(ItemsList::class)
                ->set('isManageItemsModalOpen', true)
                ->set('itemTypeBeingAdded', Item::TYPE_YOUTUBE_VIDEO)
                ->assertDontSee('Add a new YouTube video');
    }

    /** @test
     * @throws \Exception
     */
    public function an_item_can_not_be_managed_by_user_from_different_company()
    {
        $companyA = Company::factory()->create();

        $this->signInAsManager([
            'company_id' => $companyA->id,
        ]);

        $companyB = Company::factory()->create();

        $item = Item::factory()->create([
            'company_id' => $companyB->id,
        ]);

        $this->put($item->path())
             ->assertForbidden();

        $this->delete($item->path())
             ->assertForbidden();

        $this->get($item->path() . '/edit')
             ->assertForbidden();
    }

    /** @test
     * @throws \Exception
     */
    public function a_managers_can_manage_items()
    {
        $company = Company::factory()->create();

        $user = $this->signInAsManager([
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        $this->put($item->path())
             ->assertOk();

        $this->delete($item->path())
             ->assertOk();

        $this->get($item->path() . '/edit')
             ->assertOk();

        $this->get('/items/create')
             ->assertOk();

        $this->post('/items')
             ->assertOk();
    }

    /** @test */
    public function a_regular_user_can_not_manage_items()
    {
        $company = Company::factory()->create();

        $this->signIn([
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        $this->put($item->path())
             ->assertForbidden();

        $this->delete($item->path())
             ->assertForbidden();

        $this->get($item->path() . '/edit')
             ->assertForbidden();

        $this->get('/items/create')
             ->assertForbidden();

        $this->post('/items')
             ->assertForbidden();
    }

    /** @test */
    public function a_regular_employee_can_not_manage_items()
    {
        $company = Company::factory()->create();

        $user = $this->signInAsEmployee([
            'company_id' => $company->id,
        ]);

        $item = Item::factory()->create([
            'company_id' => $company->id,
        ]);

        $this->put($item->path())
             ->assertForbidden();

        $this->delete($item->path())
             ->assertForbidden();

        $this->get($item->path() . '/edit')
             ->assertForbidden();

        $this->get('/items/create')
             ->assertForbidden();

        $this->post('/items')
             ->assertForbidden();
    }
}
