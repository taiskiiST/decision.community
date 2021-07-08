<?php

namespace Tests;

use App\Models\User;
use App\Services\GateApi;
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
     * @param bool $asEmployee
     * @param bool $asManager
     * @param bool $asAdmin
     *
     * @return \App\Models\User
     */
    protected function signIn(array $userParams = [], bool $asEmployee = false, bool $asManager = false, bool $asAdmin = false): User
    {
        $factory = User::factory();

        if ($asEmployee) {
            $factory = $factory->withViewEmployeeItemsPermission();
        }

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

    /** @noinspection PhpUnusedParameterInspection */
    protected function mockThumbMaker()
    {
        $mockedThumbMaker = $this->createMock(ThumbMaker::class);

        $mockedThumbMaker->method('makeFromImageUrl')->will(
            $this->returnCallback(function (string $imageUrl, string $outputPath) {
                Storage::put($outputPath, 'Test');

                return true;
            }));


        $mockedThumbMaker->method('makeFromFile')->will(
            $this->returnCallback(function (string $imageUrl, string $outputPath) {
                Storage::put($outputPath, 'Test');

                return true;
            }));

        $this->instance(ThumbMaker::class, $mockedThumbMaker);
    }

    /**
     *
     */
    protected function mockYoutube()
    {
        $mockedYoutube = $this->createMock(Youtube::class);

        $mockedYoutube->method('getVideoInfo')->will(
            $this->returnCallback(function (string $url) {
                return [
                    'title' => 'Start Your Ag Career as a Co-Alliance Field Scout',
                    'thumbnailUrl' => 'https://i.ytimg.com/vi/haKKtOHs-XM/hqdefault.jpg'
                ];
            }));

        $this->instance(Youtube::class, $mockedYoutube);
    }

    /**
     * @param array $employeeGrowers
     */
    protected function mockGateApiEmployeeGrowers(array $employeeGrowers)
    {
        session()->put('stripped_token', 'some_stripped_token');

        $mockedGateApi = Mockery::mock(GateApi::class)->makePartial();
        $mockedGateApi->shouldReceive('employeeGrowers')->andReturn(
            new LazyCollection($employeeGrowers)
        );

        $this->app->bind(GateApi::class, function() use ($mockedGateApi) {
            return $mockedGateApi;
        });
    }

    /**
     * @param array $employeeGrowers
     * @param array $managerSalespeople
     */
    protected function mockGateApiEmployeeGrowersAndManagerSalespeople(array $employeeGrowers, array $managerSalespeople)
    {
        session()->put('stripped_token', 'some_stripped_token');

        $mockedGateApi = Mockery::mock(GateApi::class)->makePartial();

        $mockedGateApi->shouldReceive('managerSalespeople')->andReturn(
            new LazyCollection($managerSalespeople)
        );

        $mockedGateApi->shouldReceive('employeeGrowers')->andReturn(
            new LazyCollection($employeeGrowers)
        );

        $this->app->bind(GateApi::class, function() use ($mockedGateApi) {
            return $mockedGateApi;
        });
    }
}
