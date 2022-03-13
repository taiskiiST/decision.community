@extends('layouts.app', [
    'headerName' => "Добавление вопроса к опросу",
])

@section('content')
    <div id="add-questions-to-poll"></div>
@endsection

@section('scripts')
    @parent()

    <script src="{!! mix('/js/AddQuestionsToPoll.js') !!}"></script>
@endsection