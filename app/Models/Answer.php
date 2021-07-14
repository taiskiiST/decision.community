<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed id
 */
class Answer extends Model
{
    use HasFactory;

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }
    public function countVotes($answer_id)
    {
        $vote = Vote::where('answer_id', '=', $answer_id)->count();
        return $vote;
    }
    public function persentOfQuestions($question_id,$answer_id)
    {
        $question = Question::find($question_id);
        $answer = Answer::find($answer_id);
        $summ = $question->countQuestionsAll($question);
        $cnt = $answer->countVotes($answer_id);
        $x = round((100*$cnt)/$summ,2);
        return $x;
    }
}
