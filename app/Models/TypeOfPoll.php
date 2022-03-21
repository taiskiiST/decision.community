<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOfPoll extends Model
{
    const PUBLIC_MEETING_TSN        = 'Общее собрание членов ТСН';
    const GOVERNANCE_MEETING_TSN    = 'Собрание Правления ТСН';
    const VOTE_FOR_TSN              = 'Опрос для членов ТСН';
    const PUBLIC_VOTE               = 'Публичный опрос';

    protected $fillable = [
        'type_of_polls'
    ];
    protected $table = 'types_of_polls';
    use HasFactory;


}
