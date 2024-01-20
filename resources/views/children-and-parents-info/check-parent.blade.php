@extends('layouts.app', [
    'headerName' => 'Сбор информации для родителей',
])

@section('content')
    @if($errors->any() )
        <div class="alert-danger">
            <ul>
                @foreach($errors->all() as $error)
                    <li>
                        <b><p style="color: red">{{$error}} </p></b>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif
    <div class="bg-white overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
            <h1 class="text-lg leading-6 font-bold text-gray-900 text-center">
                Укажите ваш номер сотового телефона, который вы указывали при подаче информации.
            </h1>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <form action="/report-school" method="GET">
                    <div>
                        <label htmlFor='parent_phone' className="mt-3 block text-sm font-medium text-gray-700">Формат ввода номера</label>
                    </div>
                    <div>
                        <label htmlFor='parent_phone' className="mt-3 block text-sm font-medium text-gray-700"><b>89XXXXXXXXX</b></label>
                    </div>
                    <input type="tel" name="phone" pattern="89[0-9]{9}"/>
                    <button type="submit" class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Отправить</button>
                </form>
            </h3>
        </div>
    </div>
@endsection
