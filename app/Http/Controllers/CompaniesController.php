<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Support\Collection;

class CompaniesController
{
    public function getExistingURIs(): Collection
    {
        return Company::existingURIs();
    }
}
