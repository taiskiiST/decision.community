<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersSeeder extends Seeder
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
            'address' => 'Штрауса 22',
            'permissions' => 'access,manage-items,admin',
            'password' => '$2y$10$rsEFqgsi9w5Rfmjl2zlyTOrbh20S7EoMzKENhFyU2oAw83oX.rtKW', // 12345
            'phone' => '9185430980'
        ]);

		User::create([
            'name' => 'Sergei',
            'email' => 'test@mail.ru',
            'address' => 'Садовая 5',
            'permissions' => 'access,manage-items',
            'password' => '$2y$10$19V7rEK7RJptvN1a4v.p9uHznV0a0iGB9uDC4.0cXkflhMDFRdcYy',
            'phone' => '9881212124'
        ]);
    }
}
