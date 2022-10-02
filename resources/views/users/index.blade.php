@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
])

@section('content')
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
@endsection

@section('scripts')
    @parent()

    <script src="{!! mix('/js/ManageUsers.js') !!}"></script>
@endsection