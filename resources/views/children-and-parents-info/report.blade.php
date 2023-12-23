@extends('layouts.app', [
    'headerName' => 'Сбор информации для школьного автобуса',
])

@section('content')
    <div class="p-2">
        <!-- This example requires Tailwind CSS v2.0+ -->
        <div class="flex flex-col lg:-mt-px xl:flex">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <p class="hidden">{{$loop_cnt = 0}}</p>
                        <p class="hidden">{{$cnt_child = 0}}</p>
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    №
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-wrap text-center">
                                    ФИО родителя или родственника или лица их замещающего
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    Спень родства
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    Адрес
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    Телефон
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    Дети
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                                @foreach($informations as $information)
                                    <tr class="@if ($loop->odd) bg-gray-200 @else bg-white @endif">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                            {{ $loop_cnt + 1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                            <div class="text-xs">{{$information['full_name']}}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                            <div class="text-xs">{{$information['relationship']}}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                            <div class="text-xs">{{$information['address']}}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                            <div class="text-xs">{{$information['phone']}}</div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                            <table class="min-w-full divide-y divide-gray-200 ">
                                                <thead class="bg-gray-50">
                                                <tr>
                                                    <th scope="col" class="relative px-6 py-3 text-center">
                                                        №
                                                    </th>
                                                    <th scope="col" class="relative px-6 py-3 text-wrap text-center">
                                                        ФИО ребенка
                                                    </th>
                                                    <th scope="col" class="relative px-6 py-3 text-center">
                                                        Пол
                                                    </th>
                                                    <th scope="col" class="relative px-6 py-3 text-center">
                                                        Дата рождения
                                                    </th>
                                                    <th scope="col" class="relative px-6 py-3 text-center">
                                                        Возраст
                                                    </th>
                                                </tr>
                                                </thead>

                                                <tbody>
                                                    <p class="hidden">{{$loop_cnt_sm = 0}}</p>
                                                    @for ($cnt_child = 0; $cnt_child < $information['children_count'];$cnt_child++)
                                                        <tr class="@if ($loop->odd) bg-gray-200 @else bg-white @endif">
                                                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                                {{ $loop_cnt_sm + 1 }}
                                                            </td>
                                                            <td class="text-center">
                                                                <div class="text-xs">{{$information['child_'.$cnt_child]['full_name']}}</div>
                                                            </td>
                                                            <td class="text-center">
                                                                <div class="text-xs">{{$information['child_'.$cnt_child]['sex']}}</div>
                                                            </td>
                                                            <td class="text-center">
                                                                <div class="text-xs">{{$information['child_'.$cnt_child]['date_of_birthday']}}</div>
                                                            </td>
                                                            <td class="text-center">
                                                                <div class="text-xs">{{$information['child_'.$cnt_child]['age']}}</div>
                                                            </td>
                                                        </tr>
                                                        <p class="hidden">{{$loop_cnt_sm += 1}}</p>
                                                    @endfor
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <p class="hidden">{{$loop_cnt += 1}}</p>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

@endsection
