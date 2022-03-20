<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function question_files(): HasMany
    {
        return $this->hasMany(QuestionFile::class);
    }

    public function countVotesByQuestion($question_id)
    {
        $vote = Vote::where('question_id', '=', $question_id)->count();
        return $vote;
    }

    public function countVotesByQuestionPercent($question_id)
    {
        $question = Question::find($question_id);
        $summ = $question->countQuestionsAll($question);
        $x = 0;
        foreach ($question->answers() as $answer){
            $cnt = $answer->countVotes($answer->answer_id);
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
}
