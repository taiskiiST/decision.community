<?php

namespace App\Providers;

use App\Services\ThumbMaker;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

/**
 * Class ThumbMakerServiceProvider
 *
 * @package App\Providers
 */
class ThumbMakerServiceProvider extends ServiceProvider implements
  DeferrableProvider
{
  /**
   * Register services.
   *
   * @return void
   */
  public function register()
  {
    $this->app->singleton(ThumbMaker::class, function () {
      return new ThumbMaker();
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
    return [ThumbMaker::class];
  }
}
