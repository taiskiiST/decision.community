@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    <div class="p-2">
        <!-- This example requires Tailwind CSS v2.0+ -->
        <div class="flex flex-col hidden lg:-mt-px xl:flex">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    №
                                </th>
                                <th scope="col" class="relative px-6 py-3 whitespace-wrap">
                                    {{$poll->name}}
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    Количествой файлов
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    @if ($poll->voteFinished() )
                                        <span class="text-green-600">Голосование окончено {{date_create($poll->finished)->format('d-m-Y H:i:s')}}</span>
                                    @endif

                                </th>
                                @if (auth()->user()->canManageItems() )
                                    @if (! $poll->voteFinished() )
                                        <th scope="col" class="relative px-6 py-3">
                                            <form method="POST" action="{{route('poll.endVote',[$poll->id])}}">
                                                @csrf
                                                <a href="{{route('poll.endVote',[$poll->id])}}"
                                                   onclick="event.preventDefault();
                                                    this.closest('form').submit();" class="text-green-600 hover:text-green-900">
                                                    {{ __('Окончить голосование') }}
                                                </a>
                                            </form>
    {{--                                        <span class="text-green-600">Окончить голосование</span>--}}
                                        </th>
                                    @else
                                        <th scope="col" class="relative px-6 py-3">
                                            <form method="POST" action="{{route('poll.endVote',[$poll->id])}}">
                                                @csrf
                                                <a href="{{route('poll.endVote',[$poll->id])}}"
                                                   onclick="event.preventDefault();
                                                    this.closest('form').submit();" class="text-red-600 hover:text-red-900">
                                                    {{ __('Возобновить голосование') }}
                                                </a>
                                            </form>
    {{--                                        <span class="text-red-600">Возобновить голосование</span>--}}
                                        </th>
                                    @endif
                                @endif
                            </tr>
                            </thead>

                            <tbody>
                            @foreach($poll->questions as $question)
                                <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                        {{$loop->index + 1}}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                                        {!! $question->text !!}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                        {{ $question->question_files()->count() }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium ">
                                        @if (auth()->user()->canManageItems() )
                                            <a href="@if (!$poll->voteFinished() ){{route('poll.questions.index',[$poll->id, $question->id])}} @else # @endif" class=" @if ($poll->voteFinished() ) disabled @else text-indigo-600 hover:text-indigo-900 @endif ">Изменить вопрос</a>
                                        @endif
                                    </td>

                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                        @if (auth()->user()->canManageItems() )
                                            @if (!$poll->voteFinished() )
                                            <form method="POST" action="{{route('question.delete',[$poll->id, $question->id])}}">
                                                @csrf
                                                <input name="del_question" value="{{$question->id}}" type="hidden"/>
                                                <a href="{{route('question.delete',[$poll->id, $question->id])}}"
                                                   onclick="event.preventDefault();
                                                    this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                    {{ __('Удалить вопрос') }}
                                                </a>
                                            </form>
                                            @else
                                                <a href="#" class="disabled">
                                                    {{ __('Удалить вопрос') }}
                                                </a>
                                            @endif
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex flex-col xl:hidden">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle min-w-full sm:px-2 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-1 py-3 text-left text-xs whitespace-wrap text-wrap font-medium text-gray-500 uppercase tracking-wider">
                                    {{$poll->name}}
                                </th>
                                <th scope="col" class="relative px-1 py-3">
                                    @if ($poll->voteFinished() )
                                        <span class="text-green-600 whitespace-wrap text-wrap">Голосование окончено {{date_create($poll->finished)->format('d-m-Y H:i:s')}}</span>
                                    @endif

                                </th>
                                @if (auth()->user()->canManageItems())
                                    @if (! $poll->voteFinished() )
                                        <th scope="col" class="relative px-1 py-3">
                                            <form method="POST" action="{{route('poll.endVote',[$poll->id])}}">
                                                @csrf
                                                <a href="{{route('poll.endVote',[$poll->id])}}"
                                                   onclick="event.preventDefault();
                                                    this.closest('form').submit();" class="text-green-600 whitespace-wrap text-wrap hover:text-green-900">
                                                    {{ __('Окончить голосование') }}
                                                </a>
                                            </form>
                                            {{--                                        <span class="text-green-600">Окончить голосование</span>--}}
                                        </th>
                                    @else
                                        <th scope="col" class="relative px-1 py-3">
                                            <form method="POST" action="{{route('poll.endVote',[$poll->id])}}">
                                                @csrf
                                                <a href="{{route('poll.endVote',[$poll->id])}}"
                                                   onclick="event.preventDefault();
                                                    this.closest('form').submit();" class="text-red-600 whitespace-wrap text-wrap hover:text-red-900">
                                                    {{ __('Возобновить голосование') }}
                                                </a>
                                            </form>
                                            {{--                                        <span class="text-red-600">Возобновить голосование</span>--}}
                                        </th>
                                    @endif
                                @endif

                            </tr>
                            </thead>
                            <tbody>

                            @foreach($poll->questions as $question)
                                <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                    <td colspan=3>
                                        <div class="px-6 py-4 whitespace-wrap text-sm text-gray-900 text-center text-wrap">
                                            {{$loop->index + 1}}. {!! $question->text !!}
                                        </div>
                                        <div class="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                            Количество файлов - {{ $question->question_files()->count() }}
                                        </div>
                                        @if (auth()->user()->canManageItems())
                                            <div class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                                <a href="@if (!$poll->voteFinished() ){{route('poll.questions.index',[$poll->id, $question->id])}} @else # @endif" class=" @if ($poll->voteFinished() ) disabled @else text-indigo-600 hover:text-indigo-900 @endif ">Изменить вопрос</a>
                                            </div>
                                        @endif

                                        @if (auth()->user()->canManageItems())
                                            <div class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium bg-gray-200">
                                                @if (!$poll->voteFinished() )
                                                <form method="POST" action="{{route('question.delete',[$poll->id, $question->id])}}">
                                                    @csrf
                                                    <input name="del_question" value="{{$question->id}}" type="hidden"/>
                                                    <a href="{{route('question.delete',[$poll->id, $question->id])}}"
                                                       onclick="event.preventDefault();
                                                    this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                        {{ __('Удалить вопрос') }}
                                                    </a>
                                                </form>
                                                @else
                                                    <a href="#" class="disabled">
                                                        {{ __('Удалить вопрос') }}
                                                    </a>
                                                @endif
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
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
                <form method="GET" action="{{route('poll.questions.create',[$poll->id])}}">
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
    <script src="{!! mix('/js/AddProtocolToPoll.js') !!}"></script>
@endsection
