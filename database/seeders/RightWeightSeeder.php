<?php

namespace Database\Seeders;

use App\Models\Right;
use App\Models\TypeOfRight;
use App\Models\User;
use Illuminate\Database\Seeder;

class RightWeightSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    //fill types of rights
    $namesHash = [
      TypeOfRight::UPON_OWNERSHIP => 'Недвижимость по факту собственности',
      TypeOfRight::BY_AREA => 'Недвижимость по площади',
      TypeOfRight::MANDATE => 'Мандат',
    ];

    foreach ($namesHash as $typeId => $name) {
      TypeOfRight::updateOrCreate(
        [
          'id' => $typeId,
        ],
        [
          'id' => $typeId,
          'name' => $name,
        ]
      );
    }

    $users = User::all();
    foreach ($users as $user) {
      $user->rights()->create([
        'name' => $user->address,
        'type_of_right' => TypeOfRight::UPON_OWNERSHIP,
        'weight' => 1,
        'number_of_share' => 1,
        'grounds' => $user->ownership(),
      ]);
    }
  }
}
