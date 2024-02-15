@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    <div class="p-2">
        <!-- This example requires Tailwind CSS v2.0+ -->
        <div class="flex flex-col hidden lg:-mt-px xl:flex">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div id="PreviewTextQuestion"></div>
                </div>
            </div>
        </div>

        <div class="flex flex-col xl:hidden ">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle min-w-full sm:px-1 lg:px-8">
                    <div id="PreviewTextQuestionMobile"></div>
                </div>
            </div>
        </div>


        @if (isset($error))
            {{$error}}
        @endif
        @if ($poll->voteFinished() && auth()->user()->isAdmin())
            <div id="add-protocol-to-poll"></div>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
        @endif
        <div class="inline-flex flex-row w-full place-content-between">
            @if (auth()->user()->canManageItems())
            <div class="px-4 py-3 sm:px-6">
                <form method="POST" action="{{route('poll.questions.create',[$poll->id])}}">
                    @csrf
                    <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white @if ( !$poll->voteFinished() ) bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button  @else bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50 submit-button @endif "
                       onclick="event.preventDefault();
                        this.closest('form').submit();"
                    @if ( $poll->voteFinished() ) disabled @endif>
                        {{ __('Добавить вопрос') }}
                    </button>
                </form>

            </div>
            @endif
            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                        Назад
                    </button></a>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    @parent()
    @if ($poll->voteFinished() && auth()->user()->isAdmin())
        <script src="{!! mix('/js/AddProtocolToPoll.js') !!}"></script>
    @endif
    <script src="{!! mix('/js/PreviewTextQuestion.js') !!}"></script>
    <script src="{!! mix('/js/PreviewTextQuestionMobile.js') !!}"></script>
@endsection
