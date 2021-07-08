<?php

namespace Tests\Feature;

use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class DashboardTest
 *
 * @package Tests\Feature
 */
class AppTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function app_contains_nav_component_livewire_component()
    {
        $this->signIn();

        $this->get('/items')
             ->assertSeeLivewire('nav-component');
    }

    /** @test */
    public function only_authenticated_users_can_access_content()
    {
        $this->get('/items')->assertRedirect('login');
    }

    /** @test */
    public function a_user_can_not_access_content_without_access_permission()
    {
        $this->signIn([
            'permissions' => '',
        ]);

        $this->get('/items')->assertForbidden();
    }

    /** @test */
    public function a_user_can_access_content_with_access_permission()
    {
        $this->signIn([
            'permissions' => Permission::ACCESS,
        ]);

        $this->get('/items')->assertOk();
    }
}
