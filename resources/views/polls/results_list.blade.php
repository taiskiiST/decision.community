@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    <p style="font-size: 25px">Результаты голосования</p>
    <div>{{$poll->name}}</div>
    <br />
@foreach($poll->questions as $question)
    <b>{!! $question->text!!}</b>
    <br />

    @foreach($question->answers as $answer)
        {{$answer->text}}    -        {{$answer->countVotes()}} ({{ $answer->percentOfQuestions($question->id, $answer->id) }}%)<br/>
        @foreach($answer->listVotes($answer->id) as $vote)
            - {{$itemsIdHash[$vote->user_id]}}, {{$itemsNameHash[$vote->user_id]}}, {{$itemsPhoneHash[$vote->user_id]}}, {{$itemsAddressHash[$vote->user_id]}}<br/>
        @endforeach
        <br />
    @endforeach
Всего {{$question->countQuestionsAll($question)}} голос(ов) (100%)!<br /><br />
@endforeach
@endsection
