<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

/**
 * Class CompaniesSeeder
 *
 * @package Database\Seeders
 */
class CompaniesSeeder extends Seeder
{
    const COALLIANCE_ID = 10;

    const UNITED_PRAIRIE_ID = 31;

    const DEMO_ID = 29;

    const AVAILABLE_COMPANIES = [
        self::COALLIANCE_ID => 'Co-Alliance',
        self::UNITED_PRAIRIE_ID => 'United Prairie',
        self::DEMO_ID => 'DEMO'
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (self::AVAILABLE_COMPANIES as $id => $name) {
            /** @var Company $company */
            $company = Company::updateOrCreate([
                'id' => $id,
            ], [
                'id' => $id,
                'name' => $name,
            ]);

            Storage::makeDirectory($company->pdfDocumentsPath());

            Storage::makeDirectory($company->itemsThumbsPath());
        }
    }
}
