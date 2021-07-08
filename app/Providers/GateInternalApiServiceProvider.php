<?php

namespace App\Providers;

use App\Services\GateApi;
use App\Services\GateInternalApi;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Class GateInternalApiServiceProvider
 *
 * @package App\Providers
 */
class GateInternalApiServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(GateInternalApi::class, function ($app, array $params) {
            return new GateInternalApi();
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
        return [GateInternalApi::class];
    }
}
