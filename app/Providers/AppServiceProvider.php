<?php

namespace App\Providers;

use App\Models\Company;
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
    return;
    $allQuestions = [];
    $cnt_files_in_question = [];
    $company = Company::getCompanyBySubDomain();
    if ($company) {
      $allQuestions = $company->questions->transform(function (
        Question $question
      ) {
        $question->text = $question->succinctText();

        return $question;
      });

      foreach ($allQuestions as $question) {
        $cnt_files_in_question[$question->id] = $question
          ->question_files()
          ->count();
      }
    }

    View::share('all_questions', $allQuestions);

    \JavaScript::put([
      'all_questions' => $allQuestions,
      'itemsNameHash' => User::all()->pluck('name', 'id'),
      'itemsPollNameHash' => Poll::all()->pluck('name', 'id'),
      'cnt_files_in_question' => $cnt_files_in_question,
    ]);
  }
}
