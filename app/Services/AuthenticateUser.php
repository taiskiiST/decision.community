<?php

namespace App\Services;

use App\Http\Listeners\AuthenticateUserListener;
use App\Repositories\UserRepository;
use Laravel\Socialite\Contracts\Factory as Socialite;
use Throwable;

/**
 * Class AuthenticateUser
 *
 * @package App\Services
 */
class AuthenticateUser
{
    protected $socialite;
    protected $users;
    protected $socialiteDriver;

    /**
     * AuthenticateUser constructor.
     *
     * @param \App\Repositories\UserRepository $users
     * @param \Laravel\Socialite\Contracts\Factory $socialite
     */
    public function __construct(UserRepository $users, Socialite $socialite)
    {
        $this->users = $users;
        $this->socialite = $socialite;
        $this->socialiteDriver = config('auth.socialiteDriver');
    }

    /**
     * @param bool $hasCode
     * @param bool $hasError
     * @param \App\Http\Listeners\AuthenticateUserListener $listener
     * @param string|null $bearerToken
     *
     * @return mixed|\Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function execute(bool $hasCode, bool $hasError, AuthenticateUserListener $listener, string $bearerToken = null)
    {
        if ($hasError) {
            return $listener->userFailedToLogIn('Access denied');
        }

        // If we already have a token, then there is no need to get the
        // authorization code - just use the token to get a user.
        if ($bearerToken) {
            return $this->authenticateWithToken($bearerToken, $listener);
        }

        // If this is the first step of OAuth2 and we don't have a code yet
        // then get the authorization code from Provider.
        if (! $hasCode) {
            return $this->getAuthorizationFirst();
        }

        return $this->authenticateWithCode($listener);
    }

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    /**
     * @param \App\Http\Listeners\AuthenticateUserListener $listener
     *
     * @return mixed
     */
    protected function authenticateWithCode(AuthenticateUserListener $listener)
    {
        $userFromProvider = $this->getUserFromProviderByCode();
        if (! $userFromProvider || empty($userFromProvider->user)) {
            return $listener->userFailedToLogIn('Access denied - user info not found');
        }

        return $this->loginUserFromProvider($userFromProvider, $listener);
    }

    /**
     * @param string $bearerToken
     * @param \App\Http\Listeners\AuthenticateUserListener $listener
     *
     * @return mixed
     */
    protected function authenticateWithToken(string $bearerToken, AuthenticateUserListener $listener)
    {
        $userFromProvider = $this->getUserFromProviderByToken($bearerToken);
        if (! $userFromProvider || empty($userFromProvider->user)) {
            return $listener->userFailedToLogIn('Access denied - invalid token');
        }

        return $this->loginUserFromProvider($userFromProvider, $listener);
    }

    /**
     * Redirect the user to the Provider authentication page.
     */
    protected function getAuthorizationFirst()
    {
        return $this->socialite->driver($this->socialiteDriver)->redirect();
    }

    /**
     * @return \Laravel\Socialite\Contracts\User|null
     */
    protected function getUserFromProviderByCode()
    {
        $user = null;

        try {
            // The below call behind the scenes automatically grabs the code from the request.
            $user = $this->socialite->driver($this->socialiteDriver)->user();
        } catch (Throwable $throwable) {
            logger()->warning(__METHOD__ . ' - message:' . $throwable->getMessage());
        }

        return $user;
    }

    /**
     * @param string $token
     *
     * @return null
     */
    protected function getUserFromProviderByToken(string $token)
    {
        $user = null;

        try {
            // The below call behind the scenes automatically grabs the code from the request.
            $user = $this->socialite->driver($this->socialiteDriver)->userFromToken($token);
        } catch (Throwable $throwable) {
            logger()->warning(__METHOD__ . ' - message:' . $throwable->getMessage());
        }

        return $user;

    }

    /**
     * @param $userFromProvider
     * @param \App\Http\Listeners\AuthenticateUserListener $listener
     *
     * @return mixed
     */
    protected function loginUserFromProvider($userFromProvider, AuthenticateUserListener $listener)
    {
        $localUser = $this->users->findByUserEmailOrCreate($userFromProvider->user);

        if (! $localUser) {
            return $listener->userFailedToLogIn('Access denied - wrong user info');
        }

        auth()->login($localUser, true);

        session()->put('stripped_token', $userFromProvider->token);

        return $listener->userHasLoggedIn($localUser);
    }
}
