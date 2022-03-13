@extends('layouts.app', [
    'headerName' => "Добавление вопроса к опросу",
])

@section('scripts')
    @parent()

    <script src="{!! mix('/js/AddQuestionsToPoll.js') !!}"></script>
@endsection

@section('content')

    <div id="add-questions-to-poll"></div>



    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
@endsection
