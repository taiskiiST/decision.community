@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
])

@section('content')
    <div class="mt-10 sm:mt-0">
        <div class="p-3 md:col-span-2">
            <label class="px-12 py-4 block text-lg text-black font-semibold">Добавление Должности</label>

            <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <form method="POST" action="{{route('position.add.submit')}}" class="inline-flex flex-col">
                    @csrf
                    <div class="px-1 py-1 bg-white sm:p-6">
                        <div class="col-span-6 sm:col-span-3">
                            <label for="position" class="block text-sm font-medium text-gray-700">Введите название должности</label>
                            <input type="text" name="position_name" id="position" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required>
                        </div>
                        <button type="submit"
                                class="mt-1 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                            Добавить новую должность
                        </button>
                    </div>
                </div>
            </div>

            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <a href="{{route('position.manage')}}">
                    <button type="button"
                            class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Назад
                    </button>
                </a>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    @parent()
@endsection