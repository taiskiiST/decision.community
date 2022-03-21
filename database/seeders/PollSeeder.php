<?php

namespace Database\Seeders;

use App\Models\Poll;
use App\Models\Question;
use Illuminate\Database\Seeder;

class PollSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $poll1 = Poll::create([
            'name' => 'Основной вопрос',
            'type_of_poll' => 1
        ]);

        $question1 = $poll1->questions()->create([
            'text' => 'Проводить ли собрания в Zoom?'
        ]);

        $question1->answers()->create([
            'text' => 'Естественно!'
        ]);

        $question1->answers()->create([
            'text' => 'Возможно'
        ]);

        $question1->answers()->create([
            'text' => 'Нет, только в живую'
        ]);

        $question2 = $poll1->questions()->create([
            'text' => 'Знаете ли вы кто вашего координатора?'
        ]);

        $question2->answers()->create([
            'text' => 'Да'
        ]);

        $question2->answers()->create([
            'text' => 'Нет'
        ]);


        //////////////////////////////////////////////////////////////////////////

        $poll2 = Poll::create([
            'name' => 'Повестка дня 1 Съезда',
            'type_of_poll' => 1
        ]);
//==============================================================
        $question3 = $poll2->questions()->create([
            'text' => 'Выборы председателя Съезда:'
        ]);

        $question3->answers()->create([
            'text' => 'Корсунский Евгений Александрович'
        ]);
        $question3->answers()->create([
            'text' => 'Акматова Нуржан Асанбаева'
        ]);
        $question3->answers()->create([
            'text' => 'Пасейшвили Лейла Ачиловна'
        ]);
        $question3->answers()->create([
            'text' => 'Поляринова Лариса'
        ]);
        $question3->answers()->create([
            'text' => 'Мордвинцев Олег Александрович'
        ]);
        $question3->answers()->create([
            'text' => 'Эрави Наджиб'
        ]);
        $question3->answers()->create([
            'text' => 'Ворожцов Сергей Викторович'
        ]);
        $question3->answers()->create([
            'text' => 'Мохаммад Асмахил Абдул Маджит'
        ]);
        $question3->answers()->create([
            'text' => 'Перепелица Владимир Фёдорович'
        ]);
        $question3->answers()->create([
            'text' => 'Третьяков Сергей Владимирович'
        ]);
        $question3->answers()->create([
            'text' => 'Михальчук Ольга Юрьевна'
        ]);
        $question3->answers()->create([
            'text' => 'Динь Оксана Анатольевна'
        ]);
//==============================================================
        $question4 = $poll2->questions()->create([
            'text' => 'Выборы секретаря Съезда (отличный от председателя):'
        ]);
        $question4->answers()->create([
            'text' => 'Корсунский Евгений Александрович'
        ]);
        $question4->answers()->create([
            'text' => 'Акматова Нуржан Асанбаева'
        ]);
        $question4->answers()->create([
            'text' => 'Пасейшвили Лейла Ачиловна'
        ]);
        $question4->answers()->create([
            'text' => 'Поляринова Лариса'
        ]);
        $question4->answers()->create([
            'text' => 'Мордвинцев Олег Александрович'
        ]);
        $question4->answers()->create([
            'text' => 'Эрави Наджиб'
        ]);
        $question4->answers()->create([
            'text' => 'Ворожцов Сергей Викторович'
        ]);
        $question4->answers()->create([
            'text' => 'Мохаммад Асмахил Абдул Маджит'
        ]);
        $question4->answers()->create([
            'text' => 'Перепелица Владимир Фёдорович'
        ]);
        $question4->answers()->create([
            'text' => 'Третьяков Сергей Владимирович'
        ]);
        $question4->answers()->create([
            'text' => 'Михальчук Ольга Юрьевна'
        ]);
        $question4->answers()->create([
            'text' => 'Динь Оксана Анатольевна'
        ]);
//==============================================================
        $question5 = $poll2->questions()->create([
            'text' => 'Учреждение (создание) Профсоюза.'
        ]);
        $question5->answers()->create([
            'text' => 'За'
        ]);
        $question5->answers()->create([
            'text' => 'Против'
        ]);
        //==============================================================
        $question6 = $poll2->questions()->create([
            'text' => 'Утверждение Устава Профсоюза.'
        ]);
        $question6->answers()->create([
            'text' => 'За'
        ]);
        $question6->answers()->create([
            'text' => 'Против'
        ]);
        //==============================================================
        $question7 = $poll2->questions()->create([
            'text' => 'Избрать Комитет РПО в составе:
                    a. Корсунский Евгений Александрович
                    b. Акматова Нуржан Асанбаева
                    c. Пасейшвили Лейла Ачиловна
                    d. Поляринова Лариса
                    e. Мордвинцев Олег Александрович
                    f. Эрави Наджиб
                    g. Ворожцов Сергей Викторович
                    h. Мохаммад Асмахил Абдул Маджит
                    i. Перепелица Владимир Фёдорович
                    j. Третьяков Сергей Владимирович
                    k. Михальчук Ольга Юрьевна
                    l. Динь Оксана Анатольевна'
        ]);
        $question7->answers()->create([
            'text' => 'За'
        ]);
        $question7->answers()->create([
            'text' => 'Против'
        ]);
        //==============================================================
        $question8 = $poll2->questions()->create([
            'text' => 'Собранию предлагается утвердить состав органов 
            управления профсоюза в порядке профсоюзных организаций в 
            соответствии со списками предложенными делегатами, а так же 
            выборы руководящих и контрольно-ревизионных органов профсоюза, 
            предлагается возложить на первичные, секционные и корпоративные 
            профсоюзные организаций.'
        ]);
        $question8->answers()->create([
            'text' => 'За'
        ]);
        $question8->answers()->create([
            'text' => 'Против'
        ]);
        //==============================================================
        $question9 = $poll2->questions()->create([
            'text' => 'Поручить вновь избранному Комитету РПО поручить 
            Государственную регистрацию Профсоюза.'
        ]);
        $question9->answers()->create([
            'text' => 'За'
        ]);
        $question9->answers()->create([
            'text' => 'Против'
        ]);
        //==============================================================
        $question10 = $poll2->questions()->create([
            'text' => 'Поручить вновь избранному Комитету РПО предложить 
            текст письменного обращения к представителям действующей власти с
             целью заявлении своей политической воли о невозможности закрытия 
             рынков и выработкой стратегии дальнейших действий.'
        ]);
        $question10->answers()->create([
            'text' => 'За'
        ]);
        $question10->answers()->create([
            'text' => 'Против'
        ]);
    }
}
