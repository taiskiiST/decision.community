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
        $company_id = 0;
        if(str_replace(".".$_ENV['APP_URI'], "", $_SERVER['HTTP_HOST'] ) ){
            $usi_str = str_replace(".".$_ENV['APP_URI'], "", $_SERVER['HTTP_HOST'] );
            if (Company::where('uri', $usi_str)->count() > 0){
                $company_id = Company::where('uri', $usi_str)->first()->id;
            }
        }
        // TODO: check company before using 'id'
        if ($company_id) {
            return view('auth.login', [
                    'company_id' => $company_id]
            );
        }else{
            return view('404');
        }
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

        return redirect()->intended(route('polls.index'));
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
