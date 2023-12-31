<?php

namespace Database\Seeders;

use App\Models\Poll;
use App\Models\Question;
use Illuminate\Database\Seeder;

class PollSeeder1 extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        //////////////////////////////////////////////////////////////////////////

        $poll2 = Poll::create([
            'name' => 'Заочное собрание'
        ]);
//==============================================================
        $question3 = $poll2->questions()->create([
            'text' => 'Отчет за 2 квартал 2021 года<br />
						<ul>
						<li><a href="https://cloud.mail.ru/public/PEd8/Dnm9LN7kU">Бухгалтерская отчетность за 2-ой квартал 2021г по ТСН "КП Березка" и ТСН "Березки"</a></li>
						<li><a href="https://cloud.mail.ru/public/PbVt/nKZy3QPo9">Управленческие отчеты (доход, расход, информация о количестве плательщиков и неплательщиков)</a></li>
						</ul>
						Правление предлагает принять результаты Бухгалтерской и Управленческой отчености.
						'

        ]);

        $question3->answers()->create([
            'text' => 'Принять'
        ]);
        $question3->answers()->create([
            'text' => 'Отклонить'
        ]);

//==============================================================
        $question4 = $poll2->questions()->create([
            'text' => 'Информирование по проделанной работе по водоснабжению поселка.<br />
						<ul>
						<li><a href="#">Договор на обслуживание</a></li>
						<li><a href="#">Квитанции по оплате</a></li>
						</ul>
						Правление предлагает продолжить работу улучшению качеству водоснабжения поселка.
						'
        ]);
        $question4->answers()->create([
            'text' => 'Принять'
        ]);
        $question4->answers()->create([
            'text' => 'Отклонить'
        ]);
//==============================================================
        $question5 = $poll2->questions()->create([
            'text' => 'Информирование по проделанной работе по электроснабжению поселка<br />
						<ul>						
						<li><a href="#">На баланс ТСН принята электроподстанция</a></li>
						<li><a href="https://cloud.mail.ru/public/63nG/1uoYjmtCt">Подана заявка на опломбировку счетчиков, как только будет проведена опломбировка, у нас будет бытовой тариф.</a></li>
						</ul>	
						После опломбировки станет возможно заключить договор ТНС на прямую с ТСН. <br />
						Правление предлагает продолжить работу по получению бытового тарифа на элеткроэнергию.
			'
        ]);
        $question5->answers()->create([
            'text' => 'Принять'
        ]);
        $question5->answers()->create([
            'text' => 'Отклонить'
        ]);
        //==============================================================
        $question6 = $poll2->questions()->create([
            'text' => 'Отчет по прочей работе председателя (переписка и официальные ответы).<br />
						<ul>
						<li><a href="https://cloud.mail.ru/public/cwbR/DxAR98dTn">Ответ АПН по РО и РК 15 06 2021 (По загрязнению воздуха)</a></li>
						<li><a href="https://cloud.mail.ru/public/kena/BuAeUdkSB">Ответ роспотребнадзора от 05 07 2021 (По загрязнению воздуха)</a></li>
						<li><a href="https://cloud.mail.ru/public/rrgr/HJ3oE65rM">Ответ минприроды от 09 07 2021 (По незаконной свалке мусора на учатке Погодина)</a></li>
						<li><a href="https://cloud.mail.ru/public/pzbq/reKKtrUnh">Ответ минприроды от 16-17 06 2021 (По незаконной свалке мусора на учатке Погодина)</a></li>
						<li><a href="https://cloud.mail.ru/public/xYMd/kgkzpRt2E">Ответ прокуратуры от 05 07 2021 (По незаконной свалке мусора на учатке Погодина)</a></li>
						</ul>
						Правление предлагает продолжить деловую переписку с органами власти по вопросам загрязнения воздуха, организации незаконной свалки на участке Погодина.
			'
        ]);
        $question6->answers()->create([
            'text' => 'Принять'
        ]);
        $question6->answers()->create([
            'text' => 'Отклонить'
        ]);
        //==============================================================
        $question7 = $poll2->questions()->create([
            'text' => 'Должностные обязанности председателя/управляющего и график работ.<br />
                   Предлагается принять в следующием виде:<br />
				   <ul>
						<li><a href="https://cloud.mail.ru/public/M3Ao/EYpzcK6Su">Должностные обязанности председателя/управляющего</a></li>
						<li>График работы: понедельник - пятница, с 9:00 до 18:00</li>
					</ul>
				   '
        ]);
        $question7->answers()->create([
            'text' => 'Принять'
        ]);
        $question7->answers()->create([
            'text' => 'Отклонить'
        ]);
        //==============================================================
        $question8 = $poll2->questions()->create([
            'text' => 'Собранию предлагается сменить управляющего Третьякова Сергея Владимировича.'
        ]);
        $question8->answers()->create([
            'text' => 'За'
        ]);
        $question8->answers()->create([
            'text' => 'Против'
        ]);
    }
}
