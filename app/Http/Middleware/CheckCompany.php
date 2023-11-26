<?php

namespace App\Http\Middleware;

use App\Models\Company;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class CheckCompany
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  ...$guards
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $subdomain = Arr::first(explode('.', request()->getHost()));

        $company = Company::where('uri', $subdomain)->first();
        if (!$company) {
            abort(404);
        }

        session()->put('current_company', $company);
        session()->save();

        return $next($request);
    }
}
