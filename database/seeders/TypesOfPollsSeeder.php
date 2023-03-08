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
            'type_of_poll' => 'Принятие решений членами сообщества'
        ]);
        TypeOfPoll::create([
            'type_of_poll' => 'Принятие решений членами правления'
        ]);
        TypeOfPoll::create([
            'type_of_poll' => 'Отчет о проделанной работе'
        ]);
        ypeOfPoll::create([
            'type_of_poll' => 'Предложение к рассмотрению вопроса'
        ]);
//        TypeOfPoll::create([
//            'type_of_poll' => 'Опрос для членов ТСН'
//        ]);
//        TypeOfPoll::create([
//            'type_of_poll' => 'Публичный опрос'
//        ]);
    }
}
