<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeOfPoll extends Model
{
    const PUBLIC_MEETING_TSN        = 'Принятие решений членами сообщества';
    const GOVERNANCE_MEETING_TSN    = 'Принятие решений членами правления';
    //const VOTE_FOR_TSN              = 'Опрос для членов ТСН';
    //const PUBLIC_VOTE               = 'Публичный опрос';
    const REPORT_DONE               = 'Отчет о проделанной работе';
    const SUGGESTED_POLL            = 'Предложение к рассмотрению вопроса';

    protected $fillable = [
        'type_of_polls'
    ];
    protected $table = 'types_of_polls';
    use HasFactory;


}
