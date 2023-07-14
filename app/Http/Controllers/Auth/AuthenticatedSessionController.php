<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Company;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     *
     * @return \Illuminate\View\View
     */
    public function create()
    {

//        if (!str_replace($_ENV['APP_URI'], "", $_SERVER['HTTP_HOST'] ) ){
//            return view('main');
//        }else{
//            return view('auth.login', ['company_id' => Company::where('uri', str_replace(".".$_ENV['APP_URI'], "", $_SERVER['HTTP_HOST'] ))->first()->id] );
//        }

        dump(auth()->user());

        // TODO: check company before using 'id'
        return view('auth.login', [
            'company_id' => Company::where('uri', str_replace(".".$_ENV['APP_URI'], "", $_SERVER['HTTP_HOST'] ))
                                   ->first()->id]
        );
    }

    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        $company = Company::find($request->company_id);
        $request->session()->put('current_company', $company);

        return redirect()->intended(RouteServiceProvider::HOME);
        //return redirect()->intended($_SERVER['HTTP_REFERER'].'/polls');
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        //return redirect('/');
        return redirect($request->uri_poll);
    }
}
