<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function view404()
    {
        return view('404');
    }

    public function main()
    {
        $company = Company::current();

        return view($company->mainView(), [
            'companyName' => $company->title,
            'companyDescription' => $company->description,
        ]);
    }
}
