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
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    №
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-wrap text-center">
                                    Группа возраста
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    Количество детей
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            @foreach($age_by_group as $group_age)
                                <tr class="@if ($loop->odd) bg-gray-200 @else bg-white @endif">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                        {{ $loop_cnt + 1 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                        <div class="text-xs">{{$group_age['group_age']}} @if ($group_age['group_age'] == 1) год @else лет @endif </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                        <div class="text-xs">{{$group_age['count_of_group_age']}}</div>
                                    </td>
                                </tr>
                                <p class="hidden">{{$loop_cnt += 1}}</p>
                            @endforeach
                            </tbody>
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    <span class="sr-only">Действия</span>
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-wrap text-center">
                                    Всего
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    {{$total_count_children}}
                                </th>
                            </tr>
                            </thead>

                        </table>
                    </div>
                </div>
            </div>
        </div>

@endsection
