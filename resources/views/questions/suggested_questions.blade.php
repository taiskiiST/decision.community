@extends('layouts.app', [
    'headerName' => "Общедоступные вопросы",
])

@section('styles')
    @parent

    <style>
        .star {
            color: #7c3aed;
        }
        .Highlight{
            background-color: rgb(129 140 248);
        }
    </style>
@endsection

@section('content')
    <div id="suggested_questions"></div>

@endsection

@section('scripts')
    @parent()

    <script src="{!! mix('/js/SuggestedQuestions.js') !!}"></script>

@endsection