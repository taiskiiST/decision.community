<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;

class CompaniesController
{
    public function getExistingURIs(): Collection
    {
        return Company::existingURIs();
    }

    public function createCompany(Request $request)
    {
        $inputs = $request->input();
        //dd($inputs);
        $company = new Company([
            'uri' => $inputs['subDomain'],
            'title' => $inputs['company_title'],
        ]);
        $company->save();
        try{
            $user = $company->users()->updateOrCreate(
                [
                    'email' => $inputs['client_email'],
                    'phone' => $inputs['phone'],
                ],
                [
                    'name' => $inputs['client_name'],
                    'address' => $inputs['client_address'],
                    'email' => $inputs['client_email'],
                    'phone' => $inputs['phone'],
                    'password'      => Hash::make($inputs['phone']),
                    'permissions'   => 'admin,access',
                    'additional_id' => null
                ]
            );
        }catch (\Illuminate\Database\QueryException $ex){
            dd($ex->getMessage());
        }

        return redirect("http://".$inputs['subDomain'].".".$_ENV['APP_URI']);
    }

}
