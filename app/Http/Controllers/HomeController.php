<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Support\Arr;

class HomeController {

    public function index()
    {
        //dd(request()->getHost());
        $domain = Arr::first(explode('.', request()->getHost()));
       // dd($domain);
        if ($domain === config('app.first-level-domain')) {
            \JavaScript::put([
                'FETCH_EXISTING_SUBDOMAINS_URL' => route('companies.get-existing-uris'),
                'regCompanyUrl' => route('companies.registration'),
                'getExistEmailsUrl' => route('users.get-existing-emails'),
                'getExistPhonesUrl' =>  route('users.get-existing-phones'),
                'csrf_token'    => csrf_token(),
            ]);

            return view('home.index');
        }

        $company = Company::where('uri', $domain)->first();

        if (!$company) {
            abort(404);
        }

        return redirect()->route('polls.index');
    }
}
