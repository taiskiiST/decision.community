<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quorum extends Model
{
    use HasFactory;

    protected $fillable = [
        'all_users_that_can_vote',
        'company_id'
    ];
    protected $table = 'quorums';
    public $timestamps = true;
}
