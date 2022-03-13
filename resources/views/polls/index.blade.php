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
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                                <tr>
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
                                    <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ $poll->name }}
                                        </td>
                                        @if (! $poll->voteFinished() )
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span class="text-green-600">Голосование активно</span>
                                            </td>
                                        @else
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span class="text-red-600">Голосование окончено {{date_create($poll->finished)->format('d-m-Y H:i:s')}}</span>
                                            </td>
                                        @endif
                                        @if (! $poll->authUserVote() && auth()->user()->canVote())
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="{{route('poll.display',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Голосовать</a>
                                            </td>
                                        @else
                                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <span class="text-red-600">Вы уже проголосовали</span>
                                            </td>
                                        @endif
                                        <!-- show.blade.php -->
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="{{ $poll->path() }}" class="text-indigo-600 hover:text-indigo-900">Просмотр</a>
                                        </td>

                                        @if (auth()->user()->canManageItems())
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="{{route('poll.update',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Редактировать</a>
                                        </td>
                                        @endif
                                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <a href="{{route('poll.results',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Результаты</a>
                                        </td>
                                        @if (auth()->user()->canManageItems())
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
                                        @endif
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex flex-col xl:hidden ">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название проводимого голосования
                                </th>

                            </tr>
                            </thead>

                            <tbody>
                            @foreach($polls as $poll)
                                <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                    <td>
                                        <div class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                                            {{ $poll->name }}
                                        </div>
                                        @if (! $poll->voteFinished() )
                                            <div class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                                Голосование активно
                                            </div>
                                        @else
                                            <div class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium text-red-600 bg-gray-200">
                                                Голосование окончено {{date_create($poll->finished)->format('d-m-Y H:i:s')}}
                                            </div>
                                        @endif


                                        @if (! $poll->authUserVote() && auth()->user()->canVote())
                                            <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="{{route('poll.display',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Голосовать</a>
                                            </div>
                                        @else
                                            <div class="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <span class="text-red-600">Вы уже проголосовали</span>
                                            </div>
                                        @endif

                                    <!-- show.blade.php -->
                                        <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium bg-gray-200">
                                            <a href="{{ $poll->path() }}" class="text-indigo-600 hover:text-indigo-900">Просмотр</a>
                                        </div>

                                        @if (auth()->user()->canManageItems())
                                            <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="{{route('poll.update',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Редактировать</a>
                                            </div>
                                        @endif
                                        <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium @if (auth()->user()->canManageItems()) bg-gray-200 @endif ">
                                            <a href="{{route('poll.results',[$poll->id])}}" class="text-indigo-600 hover:text-indigo-900">Результаты</a>
                                        </div>
                                        @if (auth()->user()->canManageItems())
                                            <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <form method="POST" action="{{ route('poll.delete',[$poll->id]) }}">
                                                    @csrf
                                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                                    <input name="del_poll" value="{{$poll->id}}" type="hidden"/>
                                                    <a href="{{route('poll.delete',[$poll->id])}}"
                                                       onclick="event.preventDefault();
                                                            this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                        {{ __('Удалить') }}
                                                    </a>
                                                </form>
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

        @if (auth()->user()->canManageItems())
        <a href="{{route('polls.create')}}" class="w-56 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Создать новый опрос
        </a>
        @endif
    </div>
@endsection
