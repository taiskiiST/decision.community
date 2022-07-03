@extends('layouts.app', [
    'headerName' => "Поиск",
])

@section('content')
    <div class="p-2">
        <!-- This example requires Tailwind CSS v2.0+ -->
        <div class="flex flex-col hidden lg:-mt-px xl:flex">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    №
                                </th>
                                <th scope="col" class="relative px-6 py-3 whitespace-wrap">
                                   <p >Результаты поиска по запросу: {{$search_text}}</p>
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    Количествой файлов
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    Детали
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            @foreach($questions as $question)
                                <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                        {{$loop->index + 1}}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                                        {!! $question->text !!}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                        {{ $question->question_files()->count() }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                        <a href="{{route('poll.questions.view_question',[$question->id])}}" class="text-indigo-600 hover:text-indigo-900">Просмотр вопроса</a>
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium ">
                                    </td>

                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col xl:hidden ">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle min-w-full sm:px-1 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200 flex flex-col">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-1 py-3 text-left text-xs whitespace-wrap text-wrap font-medium text-gray-500 uppercase tracking-wider">
                                    <p >Результаты поиска по запросу: {{$search_text}}</p>
                                </th>
                                <th scope="col" class="relative px-1 py-3">

                                </th>

                            </tr>
                            </thead>
                            <tbody>

                            @foreach($questions as $question)
                                <tr class="bg-white bg-gray-100 border-b border-gray-400 flex flex-col">
                                    <td colspan=3>
                                        <div class="px-6 py-4 whitespace-wrap text-sm text-gray-900 text-left text-wrap">
                                            {{$loop->index + 1}}. {!! $question->text !!}
                                        </div>
                                        <div class="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                            Количество файлов - {{ $question->question_files()->count() }}
                                        </div>
                                        <div class="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600">
                                            <a href="{{route('poll.questions.view_question',[$question->id])}}" class="text-indigo-600 hover:text-indigo-900">Просмотр вопроса</a>
                                        </div>

                                    </td>
                                </tr>
                            @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


        @if (isset($error))
            {{$error}}
        @endif

        <div class="inline-flex flex-row w-full place-content-between">
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
@endsection