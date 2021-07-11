<?php

namespace App\Providers;

use App\Models\Item;
use App\Models\Permission;
use App\Models\User;
use App\Policies\ItemPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Item::class => ItemPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('access-app', function (User $user) {
            return in_array(Permission::ACCESS, explode(',', $user->permissions));
        });

        Gate::define('manage-items', function (User $user) {
            return $user->canManageItems();
        });
    }

    public function register()
    {
        // We use our custom Socialite Extender on local machine to prevent the following curl error:
        // `cURL error 60: SSL certificate problem: unable to get local issuer certificate`
        // We add a `guzzle` option to additional config keys. This lets us configure Guzzle
        // when making requests. We set Guzzle's `verify` option to false on a local machine.
        $this->app->bind(
            'App\Http\Listeners\SocialiteWasCalledListener',
            $this->app->isLocal() || $this->app->runningUnitTests()
                ? 'App\Extensions\SocialiteProviders\LaravelPassport\ExtendSocialiteWithGuzzleOptions'
                : 'SocialiteProviders\LaravelPassport\LaravelPassportExtendSocialite'
        );
    }
}
