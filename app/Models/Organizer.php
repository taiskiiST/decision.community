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
        'user_counter_votes_id'
    ];
    protected $table = 'organizers';
}
