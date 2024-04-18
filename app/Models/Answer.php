<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property mixed id
 * @property mixed $votesNumber
 */
class Answer extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
    public function votesAnonymous(): HasMany
    {
        return $this->hasMany(AnonymousVote::class);
    }

    public function countVotes()
    {
        $vote = Vote::where('answer_id', '=', $this->id)->count();
        return $vote;
    }
    public function countVotesAnonymous($answer_id)
    {
        $vote = AnonymousVote::where('answer_id', '=', $answer_id)->count();
        return $vote;
    }

    public function listVotes($answer_id)
    {
        $votes = Vote::where('answer_id', '=', $answer_id)->get();
        return $votes;
    }

    public function percentOfQuestions($question_id,$answer_id)
    {
        $question = Question::find($question_id);
        $answer = Answer::find($answer_id);
        $summ = $question->countQuestionsAll($question);
        $cnt = $answer->countVotes();
        if ($summ != 0) {
            $x = round((100 * $cnt) / $summ, 2);
        }else{
            $x = 0;
        }
        return $x;
    }

    public function percentOfQuestionsAnonymous($question_id,$answer_id)
    {
        $question = Question::find($question_id);
        $answer = Answer::find($answer_id);
        $summ = $question->countQuestionsAllAnonymous($question);
        $cnt = $answer->countVotesAnonymous($answer_id);
        if ($summ != 0) {
            $x = round((100 * $cnt) / $summ, 2);
        }else{
            $x = 0;
        }
        return $x;
    }
}
