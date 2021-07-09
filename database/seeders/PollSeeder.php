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
            'name' => 'Дебильный опрос'
        ]);

        $question1 = $poll1->questions()->create([
            'text' => 'Серый Третьяков пёс?'
        ]);

        $question1->answers()->create([
            'text' => 'Естественно!'
        ]);

        $question1->answers()->create([
            'text' => 'Возможно'
        ]);

        $question1->answers()->create([
            'text' => 'Нет'
        ]);

        $question2 = $poll1->questions()->create([
            'text' => 'Любимый цвет'
        ]);

        $question2->answers()->create([
            'text' => 'Красный'
        ]);

        $question2->answers()->create([
            'text' => 'Зеленый'
        ]);

        $question2->answers()->create([
            'text' => 'Синий'
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
