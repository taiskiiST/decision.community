@extends('layouts.app', [
    'headerName' => 'Сводная таблица',
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
                                <th scope="col" class="relative px-3 py-3 text-center">
                                    №
                                </th>
                                <th scope="col" class="relative px-3 py-3 text-wrap text-center">
                                    Группа возраста
                                </th>
                                <th scope="col" class="relative px-8 py-3 text-center">
                                    Список детей
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            @foreach($age_by_group as $age => $children)
                                <tr class="@if ($loop->odd) bg-gray-200 @else bg-white @endif">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                        {{ $loop_cnt + 1 }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                        <div class="text-xs">{{$age}}
                                            @if ($age == 1) год @endif
                                            @if ($age > 1 && $age < 5) года @endif
                                            @if ($age >= 5 || $age == 0) лет @endif
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900 text-center">
                                    <table class="min-w-full divide-y divide-gray-200 ">
                                        <p hidden="true">{{$loop_child = 1}}</p>
                                        <thead>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Номер
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Название учебного заведения
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Адрес заведения
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                График и время туда
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                График и время обратно
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                ФИО родителя
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Степень родства
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Адрес родителя
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Контакт родителя
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                ФИО ребенка
                                            </th>
                                            <th class="border-2" style="@if ($loop->odd) border-color: rgb(255 255 255) @endif ">
                                                Пол
                                            </th>

                                        </thead>
                                        <p hidden="true">{{$loop_out = $loop->odd}}</p>
                                        @foreach($children as $child_age)
                                            <tr>
                                                <td class="border-2" style="@if ($loop_out) border-color: rgb(255 255 255) @endif ">{{$loop_child}}</td>
                                                @foreach($child_age as $child)
                                                    <td class="border-2" style="@if ($loop_out) border-color: rgb(255 255 255) @endif ">
                                                        <div class="text-xs">{{$child}}</div>
                                                    </td>
                                                @endforeach
                                            </tr>
                                            <p hidden="true">{{$loop_child += 1}}</p>
                                        @endforeach
                                    </table>
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
                                    Всего детей
                                </th>
                                <th scope="col" class="relative px-6 py-3 text-center">
                                    {{$total_count_children}} детей
                                </th>
                            </tr>
                            </thead>

                        </table>
                    </div>
                </div>
            </div>
        </div>

@endsection
