<?php

namespace App\Extensions\SocialiteProviders\LaravelPassport;

use SocialiteProviders\LaravelPassport\LaravelPassportExtendSocialite;
use SocialiteProviders\Manager\SocialiteWasCalled;

/**
 * Class ExtendSocialiteWithGuzzleOptions
 *
 * @package App\Extensions\SocialiteProviders\LaravelPassport
 */
class ExtendSocialiteWithGuzzleOptions extends LaravelPassportExtendSocialite
{
  /**
   * Execute the provider.
   * @param SocialiteWasCalled $socialiteWasCalled
   */
  public function handle(SocialiteWasCalled $socialiteWasCalled)
  {
    $socialiteWasCalled->extendSocialite(
      config('auth.socialiteDriver'),
      ProviderWithGuzzleAdditionalKey::class
    );
  }
}
