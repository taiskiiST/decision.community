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
