<?php

namespace App\Providers;

use App\Services\GateApi;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Class GateApiServiceProvider
 *
 * @package App\Providers
 */
class GateApiServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(GateApi::class, function ($app, array $params) {
            return new GateApi($params['strippedToken']);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [GateApi::class];
    }
}
