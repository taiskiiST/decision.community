<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organizer extends Model
{
    use HasFactory;
    protected $fillable = [
        'poll_id',
        'user_chairman_id',
        'user_secretary_id',
        'user_counter_votes_id',
        'users_invited_id'
    ];
    protected $table = 'organizers';

    public function isInvited($user_id): bool
    {
        return in_array($user_id, explode(',', $this->users_invited_id));
    }
}
