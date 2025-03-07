<?php

namespace App\Http\Listeners;

use SocialiteProviders\Manager\SocialiteWasCalled;

/**
 * Interface SocialiteWasCalledListener
 *
 * @package App\Http\Listeners
 */
interface SocialiteWasCalledListener
{
  /**
   * @param \SocialiteProviders\Manager\SocialiteWasCalled $socialiteWasCalled
   *
   * @return mixed
   */
  public function handle(SocialiteWasCalled $socialiteWasCalled);
}
