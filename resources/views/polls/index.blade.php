@extends('layouts.app', [
    'headerName' => 'Опросы',
])

@section('content')
    <div class="p-2">
    <!-- This example requires Tailwind CSS v2.0+ -->
        <div class="flex flex-col hidden lg:-mt-px xl:flex">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <p class="hidden">{{$loop_cnt = 0}}</p>
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Действия</span>
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Название проводимого голосования
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Действия</span>
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Действия</span>
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Действия</span>
                                    </th>
                                    <th scope="col" class="relative px-6 py-3">
                                        <span class="sr-only">Действия</span>
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                @foreach($polls as $poll)
                                    @if( $poll->isSuggestedQuestion())
                                        @if ( $poll->questions()->get()->count() )
                                            @if ($poll->questions()->first()->is_editing)
                                                @continue
                                            @endif
                                        @endif
                                    @endif
                                    <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $loop_cnt + 1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                                            @if ($poll->isPublicMeetingTSN()) <div class="text-xs font-bold">Принятие решений членами сообщества</div>@endif
                                            @if ($poll->isGovernanceMeetingTSN()) <div class="text-xs font-bold">Принятие решений членами правления</div>@endif

                                            @if ($poll->isReportDone()) <div class="text-xs font-bold">Отчет по проделанной работе</div>@endif

                                            @if (auth()->user()->isAdmin())
                                                <div><a href={{route("poll.requisites",['poll'=>$poll->id])}}>{{ $poll->name }}</a></div>
                                            @else
                                                @if( $poll->isSuggestedQuestion())
                                                    @if ( $poll->questions()->get()->count() )
                                                        <div>Тема вопроса: {{ $poll->name }}</div>
                                                    @endif
                                                @else
                                                    <div>{{ $poll->name }}</div>
                                                @endif
                                            @endif

                                            @if( $poll->isSuggestedQuestion())
                                                @if ( $poll->questions()->get()->count() )
                                                    <div class="text-xs font-bold">Автор вопроса: {{$users[$poll->questions()->first()->author] }}</div>
                                                @endif
                                            @endif
                                        </td>
                                        @if (! $poll->voteFinished() )
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span class="text-green-600">@if (! $poll->voteStart() )Голосование еще не началось@elseГолосование активно@endif</span>
                                            </td>
                                        @else
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span class="text-red-600">Голосование окончено {{date_create($poll->finished)->format('d-m-Y H:i:s')}}</span>
                                            </td>
                                        @endif
                                        @if (! $poll->authUserVote() && auth()->user()->canVote())
                                            @if ($poll->isGovernanceMeetingTSN() && !auth()->user()->isGovernance())
                                                <td class="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                                                    Доступно только для членов Правления
                                                </td>
                                            @else
                                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    @if($poll->voteFinished() || !$poll->voteStart() )
                                                        <a href="#" class="disabled text-gray-600 hover:text-gray-600 focus:text-gray-600">@if (!$poll->isReportDone())Голосовать@elseДать оценку@endif</a>
                                                    @else
                                                        <a href="{{ route('poll.display',[$poll->id])
                                                           }}" class="text-indigo-600 hover:text-indigo-900">@if (!$poll->isReportDone())Голосовать@elseДать оценку@endif</a>
                                                    @endif
                                                </td>
                                            @endif
                                        @else
                                            @if (auth()->user()->canVote())
                                                @if (!$poll->isReportDone())
                                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <span class="text-red-600">Вы уже проголосовали</span>
                                                    </td>
                                                @else
                                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        @if($poll->voteFinished() || !$poll->voteStart() )
                                                            <a href="#" class="disabled">Дать оценку</a>
                                                        @else
                                                            <a href="{{ route('poll.display',[$poll->id])
                                                           }}" class="text-indigo-600 hover:text-indigo-900">Дать оценку</a>
                                                        @endif
                                                    </td>
                                                @endif
                                            @else
                                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <span class="text-red-600">Недостаточно прав для голосования</span>
                                                </td>

                                            @endif
                                        @endif
                                        <!-- show.blade.php -->
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="{{ $poll->path() }}" class="text-indigo-600 hover:text-indigo-900">Просмотр</a>
                                        </td>

                                        @if (auth()->user()->canManageItems())
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="{{route('poll.edit',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Редактировать</a>
                                            </td>
                                        @else
                                            @if ($poll->ownPollAuthor())
                                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <form method="POST" action="{{ route('poll.delete',[$poll->id]) }}">
                                                        @csrf
                                                        <input name="del_poll" value="{{$poll->id}}" type="hidden"/>
                                                        <a href="{{route('poll.delete',[$poll->id])}}"
                                                           onclick="event.preventDefault();
                                                           if (confirm('Вы уверены, что хотите удалить свой вопрос?') ){
                                                        this.closest('form').submit();}" class="text-indigo-600 hover:text-indigo-900">
                                                            {{ __('Удалить') }}
                                                        </a>
                                                    </form>
                                                </td>
                                            @else
                                                @if( $poll->isSuggestedQuestion())
                                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    </td>
                                                @else
                                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <a href="{{route('poll.agenda',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Просмотр списком</a>
                                                    </td>
                                                @endif
                                            @endif
                                        @endif
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="{{ route('poll.results',[$poll->id])
                                                           }}" class="text-indigo-600 hover:text-indigo-900">Результаты</a>
                                        </td>
                                        @if (auth()->user()->canManageItems() && !$poll->voteFinished())
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <form method="POST" action="{{ route('poll.delete',[$poll->id]) }}">
                                                    @csrf
                                                    <input name="del_poll" value="{{$poll->id}}" type="hidden"/>
                                                    <a href="{{route('poll.delete',[$poll->id])}}"
                                                       onclick="event.preventDefault();
                                                        this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                        {{ __('Удалить') }}
                                                    </a>
                                                </form>
                                            </td>
                                        @elseif (auth()->user()->canManageItems() && $poll->voteFinished())
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" class="disabled">
                                                    {{ __('Удалить') }}
                                                </a>
                                            </td>
                                        @endif
                                        <p class="hidden">{{$loop_cnt += 1}}</p>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex flex-col xl:hidden ">
            <div class="-my-2 overflow-x-auto sm:-mx-1 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-1 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <p class="hidden">{{$loop_cnt_sml = 0}}</p>
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-1 py-3 text-left whitespace-wrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название проводимого голосования
                                </th>

                            </tr>
                            </thead>

                            <tbody>
                            @foreach($polls as $poll)
                                <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                    <td>
                                        <div class="px-1 py-1 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                                            {{ $loop_cnt_sml +1 }}
                                        </div>
                                        <div class="px-1 py-1 whitespace-wrap text-xs  font-bold text-gray-900 text-center">
                                            @if ($poll->isPublicMeetingTSN()) <div>Принятие решений членами сообщества</div>@endif
                                            @if ($poll->isGovernanceMeetingTSN()) <div>Принятие решений членами правления</div>@endif

                                            @if ($poll->isReportDone()) <div>Отчет по проделанной работе</div>@endif
                                            @if (auth()->user()->isAdmin())
                                                <div><a href={{route("poll.requisites",['poll'=>$poll->id])}}>{{ $poll->name }}</a></div>
                                            @else
                                                @if( $poll->isSuggestedQuestion())
                                                    @if ( $poll->questions()->get()->count() )
                                                        <div>Тема вопроса: {{ $poll->name }}</div>
                                                    @endif
                                                @else
                                                    <div>{{ $poll->name }}</div>
                                                @endif
                                            @endif
                                            @if( $poll->isSuggestedQuestion())
                                                @if ( $poll->questions()->get()->count() )
                                                    <div class="text-xs font-bold">Автор вопроса: {{$users[$poll->questions()->first()->author] }}</div>
                                                @endif
                                            @endif
                                        </div>
                                        @if (! $poll->voteFinished() )
                                            <div class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                                <span class="text-green-600">@if (! $poll->voteStart() )Голосование еще не началось@elseГолосование активно@endif</span>
                                            </div>
                                        @else
                                            <div class="px-6 py-4 whitespace-wrap text-left text-sm font-medium text-red-600 bg-gray-200">
                                                Голосование окончено {{date_create($poll->finished)->format('d-m-Y H:i:s')}}
                                            </div>
                                        @endif


                                        @if (! $poll->authUserVote() && auth()->user()->canVote())
                                            @if ($poll->isGovernanceMeetingTSN() && !auth()->user()->isGovernance())
                                                <div class="px-6 py-4 whitespace-wrap text-right text-sm font-medium">
                                                    Доступно только для членов Правления
                                                </div>
                                            @else
                                                <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a href="{{$poll->voteFinished()|| ! $poll->voteStart() ? '#' : route('poll.display',[$poll->id])  }}" class="@if ($poll->voteFinished() || ! $poll->voteStart()) disabled @else text-indigo-600 hover:text-indigo-900 @endif">@if (!$poll->isReportDone())Голосовать@elseДать оценку@endif</a>
                                                </div>
                                            @endif
                                        @else
                                            @if (!$poll->isReportDone())
                                                <div class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                    <span class="text-red-600">Вы уже проголосовали</span>
                                                </div>
                                            @else
                                                <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a href="{{$poll->voteFinished()|| ! $poll->voteStart() ? '#' : route('poll.display',[$poll->id])  }}" class="@if ($poll->voteFinished() || ! $poll->voteStart()) disabled @else text-indigo-600 hover:text-indigo-900 @endif">Дать оценку</a>
                                                </div>
                                            @endif
                                        @endif

                                    <!-- show.blade.php -->
                                        <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium bg-gray-200">
                                            <a href="{{ $poll->path() }}" class="text-indigo-600 hover:text-indigo-900">Просмотр</a>
                                        </div>

                                        @if (auth()->user()->canManageItems() )
                                            <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="{{route('poll.edit',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Редактировать</a>
                                            </div>
                                        @else
                                            @if( $poll->isSuggestedQuestion())

                                            @else
                                                <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <a href="{{route('poll.agenda',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Просмотр списком</a>
                                                </div>
                                            @endif
                                        @endif
                                        <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium  @if( !$poll->isSuggestedQuestion()) bg-gray-200 @endif">
                                            <a href="{{route('poll.results',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Результаты</a>
                                        </div>
                                        @if (auth()->user()->canManageItems() && !$poll->voteFinished() || $poll->ownPollAuthor())
                                            <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium @if( $poll->isSuggestedQuestion()) bg-gray-200 @endif">
                                                <form method="POST" action="{{ route('poll.delete',[$poll->id]) }}">
                                                    @csrf
                                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                                    <input name="del_poll" value="{{$poll->id}}" type="hidden"/>
                                                    <a href="{{route('poll.delete',[$poll->id])}}"
                                                       onclick="event.preventDefault();
                                                            if (confirm('Вы уверены, что хотите удалить свой вопрос?') ){
                                                        this.closest('form').submit();}" class="text-indigo-600 hover:text-indigo-900">
                                                        {{ __('Удалить') }}
                                                    </a>
                                                </form>
                                            </div>
                                        @elseif (auth()->user()->canManageItems() && $poll->voteFinished())
                                            <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" class="disabled">Удалить</a>
                                            </div>
                                        @endif
                                    </td>
                                </tr>
                                <p class="hidden">{{$loop_cnt_sml += 1}}</p>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        @if (auth()->user()->canManageItems())
            <div class="xl:inline-flex">
                <div>
                    <form method="POST" action="{{route('poll.create',['type_of_poll' => \App\Models\TypeOfPoll::PUBLIC_MEETING_TSN ])}}">
                        @csrf
                        <a href="#"
                           onclick="event.preventDefault();
                                                            this.closest('form').submit();"
                           class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            {{ __('Принятие решений членами сообщества') }}
                        </a>
                    </form>
                </div>
                <div>
                    <form method="POST" action="{{route('poll.create',['type_of_poll' => \App\Models\TypeOfPoll::GOVERNANCE_MEETING_TSN ])}}">
                        @csrf
                        <a href="#"
                           onclick="event.preventDefault();
                                                            this.closest('form').submit();"
                           class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            {{ __('Принятие решений членами правления') }}
                        </a>
                    </form>
                </div>
{{--                <div>--}}
{{--                    <a href="{{route('polls.create',['type_of_poll' =>  \App\Models\TypeOfPoll::VOTE_FOR_TSN])}}" class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">--}}
{{--                        Создать опрос для Членов ТСН--}}
{{--                    </a>--}}
{{--                </div>--}}
{{--                <div>--}}
{{--                    <a href="{{route('polls.create',['type_of_poll' =>  \App\Models\TypeOfPoll::PUBLIC_VOTE])}}" class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">--}}
{{--                        Создать Тайное голосование--}}
{{--                    </a>--}}
{{--                </div>--}}
                <div>
                    <form method="POST" action="{{route('poll.create',['type_of_poll' => \App\Models\TypeOfPoll::REPORT_DONE])}}">
                        @csrf
                        <a href="#"
                           onclick="event.preventDefault();
                                                            this.closest('form').submit();"
                           class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            {{ __('Отчет о проделанной работе') }}
                        </a>
                    </form>
                </div>
            </div>
        @endif
    </div>
@endsection
