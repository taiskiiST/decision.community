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
            'name' => 'Основной вопрос'
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
            'name' => 'Серьёзный опрос'
        ]);

        $question3 = $poll2->questions()->create([
            'text' => 'Закрывать ли Атлант-Сити?'
        ]);

        $question3->answers()->create([
            'text' => 'Да'
        ]);

        $question3->answers()->create([
            'text' => 'Нет'
        ]);
    }
}
