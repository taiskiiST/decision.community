<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Listeners\AuthenticateUserListener;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use App\Services\AuthenticateUser;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Class Oauth2LoginController
 *
 * @package App\Http\Controllers\Auth
 */
class Oauth2LoginController extends Controller implements AuthenticateUserListener
{
    /**
     * @param \App\Services\AuthenticateUser $authenticateUser
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed
     */
    public function login(AuthenticateUser $authenticateUser, Request $request)
    {
        return $authenticateUser->execute(
            $request->has('code'),
            $request->has('error'),
            $this,
            $this->bearerToken($request)
        );
    }

    /**
     * @param \App\Models\User $user
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function userHasLoggedIn(User $user)
    {
        return redirect()->intended(route('items.index'));
    }

    /**
     * @param string $message
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Http\RedirectResponse|\Illuminate\Routing\Redirector
     */
    public function userFailedToLogIn(string $message)
    {
        flash()->error($message);

        return redirect(RouteServiceProvider::HOME);
    }

    /**
     * @param \Illuminate\Http\Request $request
     *
     * @return mixed|string|null
     */
    protected function bearerToken(Request $request): ?string
    {
        $bearerToken = $request->bearerToken();
        if ($bearerToken) {
            return $bearerToken;
        }

        // Special header for iOS and other clients that remove the Authorization header on redirects. Scenario:
        // - a client (WeatherView Mobile) requesting https://weather.dataontouch.us/map-app in a WebView with
        //   a header: Authorization: Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
        // - our \App\Http\Middleware\Authenticate redirects it to the login route
        // - after the redirection the client doesn't send the Authorization header anymore
        // Solution: use a different header for such clients.
        $header = $request->header('X-Authorization', '');

        if (Str::startsWith($header, 'Bearer ')) {
            return Str::substr($header, 7);
        }

        return null;
    }
}
