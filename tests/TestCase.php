<?php

namespace Tests;

use App\Models\User;
use App\Services\ThumbMaker;
use App\Services\Youtube;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\LazyCollection;
use Mockery;

/**
 * Class TestCase
 *
 * @package Tests
 */
abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * @param array $userParams
     *
     * @return \App\Models\User
     * @throws \Exception
     */
    protected function signInAsEmployee(array $userParams = []): User
    {
        return $this->signIn($userParams, true);
    }

    /**
     * @param array $userParams
     *
     * @return \App\Models\User
     * @throws \Exception
     */
    protected function signInAsManager(array $userParams = []): User
    {
        return $this->signIn($userParams, true, true);
    }

    /**
     * @param array $userParams
     *
     * @return \App\Models\User
     * @throws \Exception
     */
    protected function signInAsAdmin(array $userParams = []): User
    {
        return $this->signIn($userParams, true, true, true);
    }

    /**
     * @param array $userParams
     * @param bool $asManager
     * @param bool $asAdmin
     *
     * @return \App\Models\User
     */
    protected function signIn(array $userParams = [], bool $asManager = false, bool $asAdmin = false): User
    {
        $factory = User::factory();

        if ($asManager) {
            $factory = $factory->withManageItemsPermission();
        }

        if ($asAdmin) {
            $factory = $factory->withAdminPermission();
        }

        $user = $factory->create($userParams);

        $this->actingAs($user);

        return $user;
    }

    /**
     * @return array
     */
    protected function userCredentials(): array
    {
        return [
            env('TEST_USER_EMAIL'),
            env('TEST_USER_PASSWORD'),
        ];
    }
}
