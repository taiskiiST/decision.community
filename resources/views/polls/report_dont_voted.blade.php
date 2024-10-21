@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])


@section('content')
    <div class="p-2">
        <!-- This example requires Tailwind CSS v2.0+ -->
        <label class="block text-lg text-black font-bold whitespace-wrap">Результаты по {{$poll->name}}</label>
        <div class="flex flex-col hidden lg:-mt-px xl:flex">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        {!! $str  !!}
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col xl:hidden ">
            <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
                <div class="py-2 align-middle min-w-full sm:px-1 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        {!! $str  !!}
                    </div>
                </div>
            </div>
        </div>
        <div class="inline-flex flex-row w-full place-content-between">

            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                        Назад
                    </button></a>
            </div>
        </div>
    </div>
@endsection
