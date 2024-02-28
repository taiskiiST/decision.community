<?php

namespace App\Models;

use App\Services\StringHelper;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property mixed id
 */
class Question extends Model
{
    use HasFactory;


    protected $guarded = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }
    public function answerThatUserVote(User $user)
    {
        $answers = $this->hasMany(Answer::class);
        foreach ($answers->get()  as $answer) {
            if (Vote::where('answer_id', '=', $answer->id)->where('user_id', '=', $user->id)->where('question_id', '=', $this->id)->count() > 0 ){
                return $answer->text;
            }
        }
    }
    public function middleAnswerThatAllUsersMarkOnReport()
    {
        $answers = $this->hasMany(Answer::class);
        $summ_all_answers = 0;
        foreach ($answers->get()  as $answer) {
            if (Vote::where('answer_id', '=', $answer->id)->where('question_id', '=', $this->id)->count() > 0 ){
                $summ_all_answers += Vote::where('answer_id', '=', $answer->id)->where('question_id', '=', $this->id)->count() * (int)$answer->text;
            }
        }
        $count_users_that_voted_by_question = Vote::where('question_id', '=', $this->id)->count();
        if ($count_users_that_voted_by_question) {
            return round($summ_all_answers / $count_users_that_voted_by_question);
        }else{
            return 0;
        }
    }
    public function speakers(): HasOne
    {
        return $this->HasOne(Speaker::class);
    }

    static function hasOwnQuestions($questions)
    {
        $user = auth()->user();
        if (!$user) {
            return false;
        }

        foreach ($questions as $question){
            if ($question->author == $user->id) {
                return true;
            }

        }
        return false;
    }

    public function poll(): HasOne
    {
        return $this->HasOne(Poll::class,'id','poll_id');
    }

    public function question_files(): HasMany
    {
        return $this->hasMany(QuestionFile::class);
    }

    public function countVotesByQuestion()
    {
        $vote = Vote::where('question_id', '=', $this->id)->count();
        return $vote;
    }
    public function countVotesByQuestionAnonymous($question_id)
    {
        $vote = AnonymousVote::where('question_id', '=', $question_id)->count();
        return $vote;
    }

    public function countVotesByQuestionPercent($question_id)
    {
        $question = Question::find($question_id);
        $summ = $question->countQuestionsAll($question);
        $x = 0;
        foreach ($question->answers() as $answer){
            $cnt = $answer->countVotes();
            if ($summ != 0) {
                $x = $x + round((100 * $cnt) / $summ, 2);
            }else{
                $x = 0;
            }
        }
        return $x;
    }

    public function countQuestionsAll(Question $question)
    {
        $summ = 0;
        $answers = $question->answers;
        foreach($answers as $answer){
            $votes[$answer->id] = Vote::where('answer_id', '=', $answer->id)->count();
            $summ += $votes[$answer->id];
        }

        return $summ;
    }

    public function countQuestionsAllAnonymous(Question $question)
    {
        $summ = 0;
        $answers = $question->answers;
        foreach($answers as $answer){
            $votes[$answer->id] = AnonymousVote::where('answer_id', '=', $answer->id)->count();
            $summ += $votes[$answer->id];
        }

        return $summ;
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->where('public', true);
    }

    public function succinctText(): string
    {
        if (!app(StringHelper::class)->isJson($this->text)) {
            return $this->text;
        }

        $decoded = json_decode($this->text, true);

        if (empty($decoded)) {
            return '';
        }

        $blocks = $decoded['blocks'];
        if (!is_array($blocks) || count($blocks) === 0) {
            return '';
        }

        return $decoded['blocks'][0]['text'];
    }
}
