<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * @property mixed id
 */
class Poll extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    /**
     * @return string
     */
    public function path(): string
    {
        return "/polls/{$this->id}";
    }
    public function notVote($poll_id)
    {
        $questions= DB::select("SELECT id FROM questions where poll_id = ?", [$poll_id]);
        foreach ($questions as $question){
                $questions_id[] = $question->id;
        }
        $items = DB::select("SELECT id FROM items where id NOT IN (SELECT item_id FROM votes where question_id IN (?) ) ", $questions_id);

        return $items;
    }

}
