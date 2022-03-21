<?php

namespace Database\Seeders;

use App\Models\TypeOfPoll;
use Illuminate\Database\Seeder;

class TypesOfPollsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        TypeOfPoll::create([
            'type_of_poll' => 'Общее собрание членов ТСН'
        ]);
        TypeOfPoll::create([
            'type_of_poll' => 'Собрание Правления ТСН'
        ]);
        TypeOfPoll::create([
            'type_of_poll' => 'Опрос для членов ТСН'
        ]);
        TypeOfPoll::create([
            'type_of_poll' => 'Публичный опрос'
        ]);
    }
}
