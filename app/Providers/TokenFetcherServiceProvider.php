<?php

namespace App\Providers;

use App\Services\TokenFetcher;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Class TokenFetcherServiceProvider
 *
 * @package App\Providers
 */
class TokenFetcherServiceProvider extends ServiceProvider implements DeferrableProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(TokenFetcher::class, function () {
            return new TokenFetcher();
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
        return [TokenFetcher::class];
    }
}
