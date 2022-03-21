<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnonymousVote extends Model
{
    use HasFactory;
    protected $fillable = [
        'question_id',
        'answer_id'
    ];
    protected $table = 'anonymous_votes';
}
