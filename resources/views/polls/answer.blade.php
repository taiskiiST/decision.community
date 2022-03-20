@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    <p style="font-size: 25px">Результаты голосования</p>
    <div>{{$poll->name}}</div>
    <br />
@foreach($poll->questions as $question)
    <b>{{$question->text}}</b>
    <br />
    @foreach($question->answers as $answer)
        {{$answer->text}}    -        {{$answer->countVotes($answer->id)}} ({{ $answer->percentOfQuestions($question->id, $answer->id) }}%)
        <br />
    @endforeach
Всего {{$question->countQuestionsAll($question)}} голоса (100%)!<br /><br />
@endforeach
@endsection
