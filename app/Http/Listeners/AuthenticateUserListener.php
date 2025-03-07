<?php

namespace App\Http\Listeners;

use App\Models\User;

/**
 * Interface AuthenticateUserListener
 *
 * @package App\Http\Listeners
 */
interface AuthenticateUserListener
{
  /**
   * @param \App\Models\User $user
   *
   * @return mixed
   */
  public function userHasLoggedIn(User $user);

  /**
   * @param string $message
   *
   * @return mixed
   */
  public function userFailedToLogIn(string $message);
}
