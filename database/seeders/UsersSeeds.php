<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersSeeds extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user = User::create([
            'name' => 'Sergei',
            'email' => 'taiskii@mail.ru',
            'permissions' => 'access,manage-items',
            'password' => '$2y$10$GGb/IPXD8tVJny7YhrnKBui9eaX1zX3KBlLrCZ.GN40lNTPTz./z2'
        ]);
    }
}
