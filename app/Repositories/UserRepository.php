<?php

namespace App\Repositories;

use App\Models\Company;
use App\Models\User;

/**
 * Class UserRepository
 *
 * @package App\Repositories
 */
class UserRepository
{
    /**
     * @param array $userData
     *
     * @return \App\Models\User|null
     */
    public function findByUserEmailOrCreate(array $userData): ?User
    {
        if (
            empty($userData['email'])
            || empty($userData['name'])
            || empty($userData['company_id'])
            || empty($userData['id'])
        ) {
            return null;
        }

        $company = Company::find($userData['company_id']);

        if (! $company) {
            return null;
        }

        return $company->users()->updateOrCreate([
            'email' => $userData['email'],
        ], [
            'email'        => $userData['email'],
            'name'         => $userData['name'],
            'gate_user_id' => $userData['id'],
            'permissions'  => implode(',', $userData['permissions']),
        ]);
    }
}
