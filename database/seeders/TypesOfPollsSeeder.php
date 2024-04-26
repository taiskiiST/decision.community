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
        $namesHash = [
            TypeOfPoll::PUBLIC_MEETING => 'Принятие решений членами сообщества',
            TypeOfPoll::GOVERNANCE_MEETING => 'Принятие решений членами правления',
            TypeOfPoll::VOTE_FOR_TSN => 'Опрос для членов ТСН',
            TypeOfPoll::PUBLIC_VOTE => 'Публичный опрос',
            TypeOfPoll::REPORT_DONE => 'Отчет о проделанной работе',
            TypeOfPoll::SUGGESTED_POLL => 'Предложение к рассмотрению вопроса',
            TypeOfPoll::INFORMATION_POST => 'Информационный пост',
        ];

        foreach ($namesHash as $typeId => $name) {
            TypeOfPoll::updateOrCreate([
                'id' => $typeId
            ], [
                'id' => $typeId,
                'type_of_poll' => $name
            ]);
        }
    }
}
