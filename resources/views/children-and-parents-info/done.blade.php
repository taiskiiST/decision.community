@extends('layouts.app', [
    'headerName' => 'Сбор информации для школьного автобуса',
])

@section('content')
    <div class="bg-white overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
            <h1 class="text-lg leading-6 font-bold text-gray-900 text-center">
                Спасибо за предоставленные данные, информация успешно добавлена!
            </h1>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <p style="text-indent: 2rem;text-align: justify;">
                    На текущий момент всего подано заявок на {{$count_children}} детей!
                    Мы продолжим работу по сбору данных для реализации поставленных целей!
                </p>
                <p style="text-indent: 2rem;text-align: justify;">
                    Ознакомиться с сводной таблицей можно, по ссылке:
                    <a href="/children-report-age" class="text-indigo-600">Сводная таблица детей по заявке на автобус</a>
                </p>
            </h3>
        </div>
    </div>
@endsection
