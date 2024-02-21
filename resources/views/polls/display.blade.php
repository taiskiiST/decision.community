@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
    'pageTitle' => $poll->name
])

@section('styles')
    @parent

    <style>
        a {
            text-decoration: none;
            color:blue
        }
        ul {
            padding:0;
            list-style: none;
        }
        ul li{

            padding:6px;
        }
        ul li:before {
            padding-right:10px;
            font-weight: bold;
            color: #C0C0C0;
            content: "\2714";
            transition-duration: 0.5s;
        }
        ul li:hover:before {
            color: #337AB7;
            content: "\2714";
        }

        button {
            background-color: transparent;
            border: none;
            outline: none;
            cursor: pointer;
        }
        .on {
            color: #000;
        }
        .off {
            color: #ccc;
        }
        .react-pdf__Page__canvas {
            margin: 0 auto;
            width: 100% !important;
            height: 100% !important;
        }
    </style>
@endsection


@section('content')
    @if($errors->any() && !$displayMode)
        <div class="alert-danger">
            <ul>
                @foreach($errors->all() as $error)
                    <li>
                        <b><p style="color: red">{{$error}} </p></b>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif

    @if (auth()->user() ? auth() && auth()->user()->canVote()|| auth()->user()->isAccess() : '' )
        @if (auth()->user()->isAccess() || (!$poll->finished && !$poll->authUserVote() && !$poll->isGovernanceMeeting() || $displayMode) || $poll->isGovernanceMeeting() && auth()->user()->isGovernance() )
            <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div class="text-center"><span style="font-size: x-large;"><b>{{$poll->name}}</b></span></div>

                <div id="displayQuestionsEditor"> </div>
            </div>
        @else
            @if ($poll->isGovernanceMeeting() && !auth()->user()->isGovernance())
                <div class="bg-gray-50">
                    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            <span class="block">Голосование '{{$poll->name}}' доступно только для членов Правления!</span>
                            <span class="block text-indigo-600">С результатами голосования можно ознакомиться нажав на кнопку.</span>
                        </h2>
                        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div class="inline-flex rounded-md shadow">
                                <a href="{{route('poll.results',[$poll->id])}}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Ознакомиться с результатами голосования
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @else
                <!-- This example requires Tailwind CSS v2.0+ -->
                <div class="bg-gray-50">
                    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        @if ($poll->finished)
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                <span class="block">Голосование '{{$poll->name}}' окончено!</span>
                                <span class="block text-indigo-600">Данный опрос окончен, с его результатами можно ознакомиться нажав на кнопку.</span>
                            </h2>
                        @else
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                <span class="block">Вы уже голосовали по опросу '{{$poll->name}}'!</span>
                                <span class="block text-indigo-600">С результатами голосования можно ознакомиться нажав на кнопку.</span>
                            </h2>
                        @endif
                        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div class="inline-flex rounded-md shadow">
                                <a href="{{route('poll.results',[$poll->id])}}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Ознакомиться с результатами голосования
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        @endif
    @endif
@endsection

@section('scripts')
    @parent()
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="{!! mix('/js/DisplayQuestionsEditor.js') !!}"></script>
    <script>

        $("#button_submit").click(
            function () {
                if (confirm('Вы `уверены`? Ответы нельзя будет изменить впоследствии.')){
                    $("#button_submit").addClass("submit_done");
                    $('#button_submit').prop('type', 'submit');
                    $("#button_submit").submit();
                }else{
                    $("#button_submit").addClass("submit_no");
                }
                return true
            }
        );

        $("#button_cancel").click(
            function () {
                //console.log(document.location.pathname.includes("display"));
                if (document.location.pathname.includes("display")) {
                    return confirm('Вы уверены что хотите прервать голосование? В этом случае ваш голос не будет зачтен!')
                }
            }
        );

        //====================================================================================

    </script>

@endsection
