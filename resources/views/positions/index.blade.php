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
            <label class="px-12 py-4 block text-lg text-black font-semibold">Должности ТСН</label>

            <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 p-5 inline-flex">
                <form method="POST" action="{{route('position.update')}}" class="inline-flex flex-col">
                    @csrf
                    <div class="lg:grid-cols-2">
                        <select name="position" id="selectPosition"
                                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            @foreach($positions as $position)
                            <option value="{{$position->id}}">{{$position->position}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <button type="submit"
                                class="mt-1 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                            Изменить наименовение должности
                        </button>
                    </div>
                </form>
                <div>
                    <form method="POST" action="{{route('position.add')}}">
                        @csrf
                        <button type="submit"
                                class="mt-1 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                            Добавить новую должность
                        </button>
                    </form>
                </div>
                <div>
                    <form method="POST" action="{{route('position.delete')}}">
                        @csrf
                        <input id="idToDelPosition" name="idToDelPosition" type="text" class="hidden" value="">
                        <button
                                class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                            Удалить выбранную должность
                        </button>
                    </form>
                </div>
            </div>

            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <a href="/governance/manage">
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
    <script src="http://code.jquery.com/jquery-1.11.3.min.js"></script>
    <script>
        jQuery(document).ready(function($){
            $('#selectPosition').on('change', function (e) {
                var value = this.value
                $('#idToDelPosition').val(value);
                //console.log($('#idToDelPosition').val());
            });
        });

    </script>
@endsection