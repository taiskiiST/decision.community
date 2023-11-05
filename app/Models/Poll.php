<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
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
    protected $fillable = [
        'name',
        'start',
        'finished',
        'type_of_poll',
        'protocol',
        'protocol_doc',
        'blank_doc',
        'blank_with_answers_doc',
        'company_id',
        'potential_voters_number'
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function isPublicMeeting(): bool
    {
        return ($this->getTypeOfPoll() == TypeOfPoll::PUBLIC_MEETING) ? true : false;
    }

    public function isGovernanceMeeting(): bool
    {
        return ($this->getTypeOfPoll() == TypeOfPoll::GOVERNANCE_MEETING) ? true : false;
    }

    public function isReportDone(): bool
    {
        return ($this->getTypeOfPoll() == TypeOfPoll::REPORT_DONE) ? true : false;
    }

    public function isSuggestedQuestion(): bool
    {
        return ($this->getTypeOfPoll() == TypeOfPoll::SUGGESTED_POLL) ? true : false;
    }

    public function isInformationPost(): bool
    {
        return ($this->getTypeOfPoll() == TypeOfPoll::INFORMATION_POST) ? true : false;
    }

//    public function isVoteForTSN(): bool
//    {
//        return ($this->getTypeOfPoll() == TypeOfPoll::VOTE_FOR_TSN) ? true : false;
//    }

//    public function isPublicVote(): bool
//    {
//        return ($this->getTypeOfPoll() == TypeOfPoll::PUBLIC_VOTE) ? true : false;
//    }

    public function getTypeOfPoll()
    {
        return $this->hasOne(TypeOfPoll::class, 'id', 'type_of_poll')->get()[0]->type_of_poll;
    }
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function ownPollAuthor()
    {
        if ($this->questions()->get()->count()){
            if ($this->questions()->first()->author == auth()->user()->id){
                return true;
            }
        }
        return false;
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

    public function reSortQuestions(): void
    {
        $position = 1;

        $this->questions()->orderBy('id')->get()->each(function (Question $question) use (&$position) {
            $question->update([
                'position_in_poll' => $position++
            ]);
        });
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function peopleThatDidNotVote(): Collection
    {
        $questions = $this->questions;
        $questions = $questions->pluck('id')->toArray();
        $usersIdsThatVoted = Vote::whereIn('question_id', $questions)->select('user_id')->get();

        //return User::whereNotIn('id', $usersIdsThatVoted)->where('is_category', false)->get();
        return User::whereNotIn('id', $usersIdsThatVoted)->get();
    }

    public function peopleThatDidNotVoteGovernance(): Collection
    {
        $questions = $this->questions;
        $questions = $questions->pluck('id')->toArray();
        $usersIdsThatVoted = Vote::whereIn('question_id', $questions)->select('user_id')->get();

        //return User::whereNotIn('id', $usersIdsThatVoted)->where('is_category', false)->get();

        return Company::find(session('current_company')->id)->users()->whereNotIn('users.id', $usersIdsThatVoted)->where('permissions','LIKE','%governance%')->get();
    }

    public function peopleThatDidNotVoteVoters(): Collection
    {
        $questions = $this->questions;
        $questions = $questions->pluck('id')->toArray();
        $usersIdsThatVoted = Vote::whereIn('question_id', $questions)->select('user_id')->get();
        return Company::find(session('current_company')->id)->users()->whereNotIn('users.id', $usersIdsThatVoted)->where('permissions','LIKE','%voter%')->get();
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

    public function voteStart () : bool
    {
        if ($this->start)
            return true;
        else
            return false;
    }

    public function protocolDone () : bool
    {
        if ($this->protocol)
            return true;
        else
            return false;
    }
}
