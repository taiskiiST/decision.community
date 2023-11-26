<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Support\Arr;

class HomeController {

    public function index()
    {
        $domain = Arr::first(explode('.', request()->getHost()));
        if ($domain === config('app.first-level-domain')) {
            return view('home');
        }

        $company = Company::where('uri', $domain)->first();
        if (!$company) {
            abort(404);
        }

        return redirect()->route('polls.index');
    }
}
