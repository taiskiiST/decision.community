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
        {{$answer->text}}    -        {{$answer->countVotes($answer->id)}} ({{ $answer->persentOfQuestions($question->id, $answer->id) }}%)<br/>
        @foreach($answer->listVotes($answer->id) as $vote)
            -{{$itemsParentIdHash[$vote->item_id]}}, {{$itemsNameHash[$vote->item_id]}}, {{$itemsPhoneHash[$vote->item_id]}}, {{$itemsAddressHash[$vote->item_id]}}<br/>
        @endforeach
        <br />
    @endforeach
Всего {{$question->countQuestionsAll($question)}} голос(ов) (100%)!<br /><br />
@endforeach
@endsection
