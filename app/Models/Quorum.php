<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quorum extends Model
{
    use HasFactory;

    protected $fillable = [
        'poll_id',
        'count_of_voting_current',
        'all_users_that_can_vote',
        'list_of_all_current_users'
    ];
    protected $table = 'quorums';
}
