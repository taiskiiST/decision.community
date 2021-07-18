<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
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

    /**
     * @return \Illuminate\Support\Collection
     */
    public function peopleThatDidNotVote(): Collection
    {
        $questions = $this->questions;

        $itemsIdsThatVoted = Vote::whereIn('question_id', $questions)->select('item_id')->get();

        return Item::whereNotIn('id', $itemsIdsThatVoted)->where('is_category', false)->get();
    }

}
