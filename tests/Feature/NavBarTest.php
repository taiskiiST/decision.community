<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Class NavBarTest
 *
 * @package Tests\Feature
 */
class NavBarTest extends TestCase
{
    use RefreshDatabase;

    /** @test
     * @throws \Exception
     */
    public function manage_link_is_only_shown_to_managers()
    {
        $this->signIn();

        $this->get('items')->assertOk()->assertDontSeeText('Manage');

        $this->signInAsEmployee();

        $this->get('items')->assertOk()->assertDontSeeText('Manage');

        $this->signInAsManager();

        $this->get('items')->assertOk()->assertSeeText('Manage');
    }

    /** @test
     * @throws \Exception
     */
    public function statistics_link_is_shown_to_managers_and_employees()
    {
        $this->signIn();

        $this->get('items')->assertOk()->assertDontSeeText('Statistics');

        $this->signInAsEmployee();

        $this->get('items')->assertOk()->assertSeeText('Statistics');

        $this->signInAsManager();

        $this->get('items')->assertOk()->assertSeeText('Statistics');
    }
}
