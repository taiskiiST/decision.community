<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Item;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Class ItemsTreeAuthTest
 *
 * @package Tests\Feature
 */
class ItemsTreeAuthTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_update_items_thumb()
    {
        /** @var Item $item */
        $item = Item::factory()->create();

        Storage::fake('local');
        $this->mockThumbMaker();
        $image = UploadedFile::fake()->image('photo1.jpg');

        $this->post(route('items-tree.update-item-thumb'), [
            'id' => $item->id,
            'image' => $image,
        ])->assertRedirect('/login');

        $user = $this->signIn([
            'company_id' => $item->company_id,
        ]);

        $this->post(route('items-tree.update-item-thumb'), [
            'id' => $item->id,
            'image' => $image,
        ])->assertForbidden();

        $user = $this->signInAsEmployee([
            'company_id' => $item->company_id,
        ]);

        $this->post(route('items-tree.update-item-thumb'), [
            'id' => $item->id,
            'image' => $image,
        ])->assertForbidden();

        $user = $this->signInAsManager([
            'company_id' => $item->company_id,
        ]);

        $this->post(route('items-tree.update-item-thumb'), [
            'id' => $item->id,
            'image' => $image,
        ])->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_update_items_name()
    {
        $this->put(route('items-tree.update-item-name'))
             ->assertRedirect('/login');

        /*
        |--------------------------------------------------------------------------
        | Regular User
        |--------------------------------------------------------------------------
        */

        $user = $this->signIn();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $newName = 'New Name';

        $this->put(route('items-tree.update-item-name'), [
            'id'   => $item->id,
            'name' => $newName,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Regular Employee
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsEmployee();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-name'), [
            'id'   => $item->id,
            'name' => $newName,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-name'), [
            'id'   => $item->id,
            'name' => $newName,
        ])->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_add_a_category()
    {
        Storage::fake('local');
        $this->mockThumbMaker();
        $image = UploadedFile::fake()->image('photo1.jpg');

        $this->post(route('items-tree.add-category'), [
            'name'  => 'New Category',
            'image' => $image,
        ])->assertRedirect('/login');

        $user = $this->signIn();

        $this->post(route('items-tree.add-category'), [
            'name'  => 'New Category',
            'image' => $image,
        ])->assertForbidden();

        $user = $this->signInAsEmployee();

        $this->post(route('items-tree.add-category'), [
            'name'  => 'New Category',
            'image' => $image,
        ])->assertForbidden();

        $user = $this->signInAsManager();

        $this->post(route('items-tree.add-category'), [
            'name'  => 'New Category',
            'image' => $image,
        ])->assertCreated();
    }

    /** @test
     * @throws \Exception
     */
    public function an_admin_can_only_remove_an_item_that_belongs_to_their_company()
    {
        /** @var \App\Models\Company $companyA */
        $companyA = Company::factory()->create();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $companyA->id,
        ]);

        /** @var Company $companyB */
        $companyB = Company::factory()->create();

        $userOfCompanyB = $this->signInAsManager([
            'company_id' => $companyB->id,
        ]);

        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertForbidden();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_remove_an_item()
    {
        $this->delete(route('items-tree.remove-item'))
             ->assertRedirect('/login');

        $user = $this->signIn();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertForbidden();

        $user = $this->signInAsEmployee();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertForbidden();

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'company_id' => $user->company_id,
        ]);

        $this->delete(route('items-tree.remove-item'), [
            'id' => $item->id,
        ])->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_access_items_tree_page()
    {
        $this->get(route('items-tree'))
             ->assertRedirect('/login');

        $this->signIn();

        $this->get(route('items-tree'))->assertForbidden();

        $this->signInAsEmployee();

        $this->get(route('items-tree'))->assertForbidden();

        $this->signInAsManager();

        $this->get(route('items-tree'))->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_get_items()
    {
        $this->get(route('items-tree.get-items'))
             ->assertRedirect('/login');

        $this->signIn();

        $this->get(route('items-tree.get-items'))->assertForbidden();

        $this->signInAsEmployee();

        $this->get(route('items-tree.get-items'))->assertForbidden();

        $this->signInAsManager();

        $this->get(route('items-tree.get-items'))->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_update_item_parent()
    {
        $this->put(route('items-tree.update-item-parent'))
             ->assertRedirect('/login');

        /*
        |--------------------------------------------------------------------------
        | Regular User
        |--------------------------------------------------------------------------
        */

        $user = $this->signIn();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $item->id,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Regular Employee
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsEmployee();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id' => $item->id,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        /** @var Item $item */
        $parentItem = Item::factory()->create([
            'name'       => 'Parent',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-parent'), [
            'id'       => $item->id,
            'parentId' => $parentItem->id,
        ])->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_update_items_employee_only()
    {
        $this->put(route('items-tree.update-item-employee-only'))
             ->assertRedirect('/login');

        /*
        |--------------------------------------------------------------------------
        | Regular User
        |--------------------------------------------------------------------------
        */

        $user = $this->signIn();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-employee-only'), [
            'id' => $item->id,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Regular Employee
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsEmployee();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-employee-only'), [
            'id' => $item->id,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsManager();

        /** @var Item $item */
        $item = Item::factory()->create([
            'name'       => 'Item A',
            'company_id' => $user->company_id,
        ]);

        $this->put(route('items-tree.update-item-employee-only'), [
            'id'           => $item->id,
            'employeeOnly' => true,
        ])->assertOk();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_add_youtube_item()
    {
        Storage::fake('local');
        $this->mockThumbMaker();
        $this->mockYoutube();

        $this->post(route('items-tree.add-youtube-item'))
             ->assertRedirect('/login');

        /*
        |--------------------------------------------------------------------------
        | Regular User
        |--------------------------------------------------------------------------
        */

        $user = $this->signIn();

        $this->post(route('items-tree.add-youtube-item'), [
            'url' => 'https://www.youtube.com/watch?v=sse6JooGP88',
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Regular Employee
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsEmployee();

        $this->post(route('items-tree.add-youtube-item'), [
            'url' => 'https://www.youtube.com/watch?v=sse6JooGP88',
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsManager();

        $this->post(route('items-tree.add-youtube-item'), [
            'url' => 'https://www.youtube.com/watch?v=sse6JooGP88',
        ])->assertCreated();
    }

    /** @test
     * @throws \Exception
     */
    public function only_authenticated_admins_can_add_pdf_item()
    {
        $this->mockThumbMaker();

        Storage::fake('local');

        $this->post(route('items-tree.add-pdf-item'))
             ->assertRedirect('/login');

        /*
        |--------------------------------------------------------------------------
        | Regular User
        |--------------------------------------------------------------------------
        */

        $user = $this->signIn();

        $file = UploadedFile::fake()->create('Cool Report.pdf', 150, 'application/pdf');

        $this->post(route('items-tree.add-pdf-item'), [
            'file' => $file,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Regular Employee
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsEmployee();

        $this->post(route('items-tree.add-pdf-item'), [
            'file' => $file,
        ])->assertForbidden();

        /*
        |--------------------------------------------------------------------------
        | Admin
        |--------------------------------------------------------------------------
        */

        $user = $this->signInAsManager();

        $this->post(route('items-tree.add-pdf-item'), [
            'file' => $file,
        ])->assertCreated();
    }
}
