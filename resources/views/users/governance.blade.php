@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
])

@section('content')
    <div class="mt-10 sm:mt-0">
        <div class="p-3 md:col-span-2">
            @if ($error)
                <div class="alert alert-danger  text-red-600">
                    <ul>
                        <li>{{ $error }}</li>
                    </ul>
                </div>
            @endif
            <div class="inline-flex flex-row w-full place-content-between">
                <div class="lg:px-4 sm:px-0 py-3 sm:px-6">
                    <label class="px-12 py-4 block text-lg text-black font-semibold">Структура Правление ТСН</label>
                </div>
                <div class="lg:px-4 sm:px-0 py-7 sm:px-6 flex-row-reverse ">
                    <form method="GET" action="{{route('position.manage')}}">
                        @csrf
                        <button type="submit"
                                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                            Управление Должностями
                        </button>
                    </form>
                </div>
            </div>
            <form method="GET" action="{{route('users.governance.manage')}}">
                @csrf
                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                    @foreach($positions as $position)
                        <div>
                            <div class="hidden">{{$flag = false}}</div>
                            @foreach($users as $user)
                                @if ($user->position_id == $position->id) <label
                                        for={{$position->position}} class="block text-sm font-medium text-gray-700 text-wrap
                                        text-center h-10">{{$position->position}}</label>
                                        <div class="hidden">{{$flag = true}}</div>
                                @endif
                                @if($loop->last && !$flag)
                                        <label
                                                for="position" class="block text-sm font-medium text-gray-700 text-wrap
                                        text-center h-10">Должность {{$position->position}} не за кем ни закреплен</label>
                                @endif
                            @endforeach
                            <select name="{{$position->id}}"
                                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                @foreach($users as $user)
                                    @if ($user->position_id == $position->id)
                                        <option value="{{$user->id}}" selected>{{$user->name}}</option>
                                    @else
                                        <option value="{{$user->id}}">{{$user->name}}</option>
                                    @endif
                                @endforeach
                            </select>
                        </div>
                    @endforeach
                </div>

                <div class="inline-flex flex-row w-full place-content-between">
                    <div class="px-4 py-3 bg-gray-50  sm:px-6">
                        <button type="submit"
                                class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                            Сохранить изменения
                        </button>
                    </div>
                    <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                        <a href="/manage/users">
                            <button type="button"
                                    class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Назад
                            </button>
                        </a>
                    </div>
                </div>
            </form>

        </div>
    </div>
@endsection

@section('scripts')
    @parent()
@endsection