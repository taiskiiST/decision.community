@extends('layouts.app', [
    'headerName' => "Результаты голосования по: {$poll->name}",
])

@section('content')
{{--    <p style="font-size: 25px">Результаты голосования</p>--}}
{{--    <div>{{$poll->name}}</div>--}}
{{--    <br />--}}
{{--@foreach($poll->questions as $question)--}}
{{--    <b>{!! $question->text!!}</b>--}}
{{--    <br />--}}
{{--    @foreach($question->answers as $answer)--}}
{{--        {{$answer->text}}    -        {{$answer->countVotes($answer->id)}} ({{ $answer->persentOfQuestions($question->id, $answer->id) }}%)--}}
{{--        <br />--}}
{{--    @endforeach--}}
{{--Всего {{$question->countQuestionsAll($question)}} голос(ов) (100%)!<br /><br />--}}
{{--@endforeach--}}

<div class="p-2">
    <!-- This example requires Tailwind CSS v2.0+ -->
    <label class="block text-lg text-black font-bold whitespace-wrap">Результаты по {{$poll->name}}</label>
    <div class="flex flex-col hidden lg:-mt-px xl:flex">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    @foreach($poll->questions as $question)
                    <label class="block text-lg text-black font-semibold mt-10 whitespace-wrap">{{$question->text}}</label>
                    <table class="min-w-full divide-y divide-gray-200 border-b-2 border-gray-400 ">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Вариант ответа
                            </th>
                            <th scope="col" class="relative text-center px-6 py-3">
                                Количество голосов
                            </th>
                            <th scope="col" class="relative text-center px-6 py-3">
                                В процентах
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        @foreach($question->answers as $answer)
                            <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                <td class="px-6 py-4 whitespace-wrap text-left font-medium text-gray-900">
                                    {{$answer->text}}
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    @if(!$poll->isPublicVote())
                                        {{$answer->countVotes($answer->id)}}
                                    @else
                                        {{$answer->countVotesAnonymous($answer->id)}}
                                    @endif
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    @if(!$poll->isPublicVote())
                                        {{$answer->percentOfQuestions($question->id, $answer->id) }}
                                    @else
                                        {{$answer->percentOfQuestionsAnonymous($question->id, $answer->id) }}
                                    @endif%
                                </td>
                            </tr>
                        @endforeach
                        <tr class="bg-white @if (!$loop->odd) bg-gray-200 @endif">
                            <td class="px-6 py-4 whitespace-wrap text-left font-bold text-gray-900">
                                ИТОГО
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                @if(!$poll->isPublicVote())
                                    {{$question->countVotesByQuestion($question->id)}}
                                @else
                                    {{$question->countVotesByQuestionAnonymous($question->id)}}
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                @if(!$poll->isPublicVote())
                                    {{$question->countVotesByQuestion($question->id)? 100 : 0 }}%
                                @else
                                    {{$question->countVotesByQuestionAnonymous($question->id)? 100 : 0 }}%
                                @endif
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col xl:hidden ">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    @foreach($poll->questions as $question)
                    <label class="block text-lg text-black font-semibold mt-6 whitespace-wrap">{{$question->text}}</label>
                    <table class="min-w-full divide-y divide-gray-200 ">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider">
                                Вариант ответа
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider">
                                Количество голосов
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider">
                                В процентах
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        @foreach($question->answers as $answer)
                            <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                <td>
                                    <div class="px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center">
                                        {{$answer->text}}
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$answer->countVotes($answer->id)}}
                                        @else
                                            {{$answer->countVotesAnonymous($answer->id)}}
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$answer->percentOfQuestions($question->id, $answer->id) }}
                                        @else
                                            {{$answer->percentOfQuestionsAnonymous($question->id, $answer->id) }}
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                            <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                <td>
                                    <div class="px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center">
                                        ИТОГО
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$question->countVotesByQuestion($question->id)}}
                                        @else
                                            {{$question->countVotesByQuestionAnonymous($question->id)}}
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$question->countVotesByQuestion($question->id)? 100 : 0 }}%
                                        @else
                                            {{$question->countVotesByQuestionAnonymous($question->id)? 100 : 0 }}%
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
    @if ($poll->protocol)
    <label class="block text-lg py-8 text-black font-bold whitespace-wrap">Итоговый протокол:</label>
    <div>
        <object data={{Storage::url($poll->protocol) }} type="application/pdf" width="100%" height="100%" class="h-96">
            <p class="py-20">
                Перейдите по ссылке для предпросмотра: <br />
                <a href={{Storage::url($poll->protocol) }} target="_blank" class="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300">ФАЙЛА</a> <br />
                PDF файла
            </p>
        </object>
    </div>
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
