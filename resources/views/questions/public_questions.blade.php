@extends('layouts.app', [
    'headerName' => "Общедоступные вопросы",
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
                                    Описание вопроса
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    Количествой файлов
                                </th>

                                <th scope="col" class="relative px-6 py-3">
                                    Детали
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            @foreach($public_questions as $question)
                                <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-right text-sm font-medium">
                                        {{$loop->index + 1}}
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-sm font-medium text-gray-900">
                                        <p class="text-xs">{!! $question->poll->name !!}</p> <br />
                                        <p class="text-lg">{!! $question->succinctText() !!}</p>
                                    </td>
                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                        {{ $question->question_files()->count() }}
                                    </td>

                                    <td class="px-6 py-4 whitespace-wrap text-wrap text-sm font-medium text-gray-900">
                                        <a href="{{route('poll.questions.view_question',['question' => $question->id, 'search'=>'form_public_page'])}}" class="text-indigo-600 hover:text-indigo-900">Просмотр</a>
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
                                    Общедоступные вопросы
                                </th>
                            </tr>
                            </thead>
                            <tbody>

                            @foreach($public_questions as $question)
                                <tr class="bg-white bg-gray-100 border-b border-gray-400 flex flex-col">
                                    <td colspan=3>
                                        <div class="px-6 py-4 whitespace-wrap text-sm text-gray-900 text-left text-wrap">
                                            <p class="text-lg">{{$loop->index + 1}}. {!! $question->succinctText() !!}</p>
                                            <i><p class="text-xs">({!! $question->poll->name !!})</p></i>
                                        </div>
                                        <div class="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600 bg-gray-200">
                                            Количество файлов - {{ $question->question_files()->count() }}
                                        </div>

                                        <div class="px-6 py-4 whitespace-wrap text-wrap text-left text-sm font-medium text-green-600">
                                            <a href="{{route('poll.questions.view_question',['question' => $question->id, 'search'=>'form_public_page'] )}}" class="text-indigo-600 hover:text-indigo-900">Просмотр вопроса</a>
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
    </div>
@endsection
