<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Support\Arr;

class HomeController {

    public function index()
    {
        $domain = Arr::first(explode('.', request()->getHost()));
        if ($domain === config('app.first-level-domain')) {
            \JavaScript::put([
                'FETCH_EXISTING_SUBDOMAINS_URL' => route('companies.get-existing-uris'),
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
