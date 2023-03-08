@extends('layouts.app', [
    'headerName' => "Создание нового опраса",
])

@section('content')

    <div class="mt-10 sm:mt-0">
        <div class="grid">
            <div class="mt-5 md:mt-0 md:col-span-2">
                {!! Form::open(['route' => ['poll.store', 'method' => 'POST']]) !!}
                <input type="text" name="type_of_poll" value={{$type_of_poll}} class="hidden">
                    <div class="col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-lg font-medium leading-6 text-gray-900 mt-6 ml-6">Предложить к рассмотрению вопрос</h3>
                        </div>
                    </div>
                    <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                            <div class="grid grid-cols-6 gap-6">
                                <div class="col-span-6 sm:col-span-3">
                                    <label for="poll-name" class="block text-sm font-medium text-gray-700">Введите тему для предлагаемого к рассмотрению вопроса</label>
                                    <input type="text" name="poll-name" id="poll-name" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                </div>
                            </div>
                        </div>
                        <div class="inline-flex flex-row w-full place-content-between">
                            <div class="px-4 py-3 bg-gray-50  sm:px-6">
                                <button type="submit" class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onclick="addQuestion()">
                                        Создать
                                </button>
                            </div>
                            <div class="px-4 py-3 bg-gray-50 sm:px-6 flex-row-reverse ">
                                <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                                    Отмена
                                </button></a>
                            </div>
                        </div>
                    </div>
                {!! Form::close() !!}
            </div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script>

    </script>


@endsection
