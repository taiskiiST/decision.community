@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
])

@section('content')


    @if ( auth()->user()->isAdmin() || auth()->user()->isSuperAdmin() )
        <div id="users"></div>
        <div class="p-2">
                <div class="inline-flex flex-row w-full place-content-between">
                        <div class="px-4 py-3 sm:px-6">
                                <a href="{{route('users.add')}}"><button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                                        Добавить нового пользователя
                                        </button></a>
                        </div>
                        <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                                <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                                                Назад
                                        </button></a>
                        </div>
                </div>
        </div>
    @else
        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span class="block">Для доступа к этой странице нужно обладать правами администратора!</span>
            <span class="block text-indigo-600">За вами уже выехали.</span>
        </h2>
    @endif
@endsection

@section('scripts')
    @parent()

    <script src="{!! mix('/js/ManageUsers.js') !!}"></script>
    <style type="text/css">
        .Highlight{
            background-color: rgb(129 140 248);
        }
    </style>


@endsection