<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property mixed $id
 */
class TypeOfPoll extends Model
{
    const PUBLIC_MEETING = 1;
    const GOVERNANCE_MEETING = 2;
    const VOTE_FOR_TSN = 3;
    const PUBLIC_VOTE = 4;
    const REPORT_DONE = 5;
    const SUGGESTED_POLL = 6;
    const INFORMATION_POST = 7;

    protected $fillable = [
        'type_of_polls'
    ];
    protected $table = 'types_of_polls';

    use HasFactory;

    public function isPublicMeeting(): bool
    {
        return $this->id === self::PUBLIC_MEETING;
    }
    public function isGovernanceMeeting(): bool
    {
        return $this->id === self::GOVERNANCE_MEETING;
    }
    public function isVoteForTsn(): bool
    {
        return $this->id === self::VOTE_FOR_TSN;
    }
    public function isPublicVote(): bool
    {
        return $this->id === self::PUBLIC_VOTE;
    }
    public function isReport(): bool
    {
        return $this->id === self::REPORT_DONE;
    }
    public function isSuggestedPoll(): bool
    {
        return $this->id === self::SUGGESTED_POLL;
    }
    public function isInformationPost(): bool
    {
        return $this->id === self::INFORMATION_POST;
    }
}
