<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

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


    public function delete()
    {
        $poll = Poll::find($this->id);
        foreach ($poll->questions()->get() as $question){
            foreach ($question->question_files()->get() as $file){
                Storage::disk('public')->delete($file->path_to_file);
            }
        }
        return Poll::where('id', $this->id)->delete();
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function peopleThatDidNotVote(): Collection
    {
        $questions = $this->questions;
        $questions = $questions->pluck('id')->toArray();
        $usersIdsThatVoted = Vote::whereIn('question_id', $questions)->select('user_id')->get();

        return User::whereNotIn('id', $usersIdsThatVoted)->where('is_category', false)->get();
    }

    public function peopleThatVote(): Collection
    {
        $questions = $this->questions;
        $questions = $questions->pluck('id')->toArray();
        $usersIdsThatVoted = Vote::whereIn('question_id', $questions)->select('user_id')->get();

        return User::whereIN('id', $usersIdsThatVoted)->get();
    }

    public function authUserVote () : bool
    {
        $user = auth()->user();
        $questions = $this->questions;
        $questions = $questions->pluck('id')->toArray();
        if (!$questions)  return false;
        if (Vote::where('question_id', $questions[0])->where('user_id', $user->id)->get()->count() > 0 )
            return true;
        else
            return false;

    }
    public function voteFinished () : bool
    {
        if ($this->finished)
            return true;
        else
            return false;
    }
}
