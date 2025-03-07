<?php

namespace App\Providers;

use App\Services\Tree;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Class TreeServiceProvider
 *
 * @package App\Providers
 */
class TreeServiceProvider extends ServiceProvider implements DeferrableProvider
{
  /**
   * Register services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->singleton(Tree::class, function () {
      return new Tree();
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
    return [Tree::class];
  }
}
