<?php

namespace App\Providers;

use App\Models\Poll;
use App\Models\Question;
use App\Models\User;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::share('all_questions', Question::all());
        $all_questions = Question::all()->transform(function (Question $question) {
            $question->text = $question->succinctText();

            return $question;
        });

        foreach ($all_questions as $question){
            $cnt_files_in_question [$question->id] = $question->question_files()->count();
        }

        \JavaScript::put([
            'all_questions' => $all_questions,
            'itemsNameHash'   => User::all()->pluck('name', 'id'),
            'itemsPollNameHash'   => Poll::all()->pluck('name', 'id'),
            'cnt_files_in_question' => $cnt_files_in_question
        ]);
    }
}
