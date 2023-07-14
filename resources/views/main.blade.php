@extends('layouts.app', [
    'headerName' => 'Опросы',
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
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Действия</span>
                                </th>
                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название проводимого голосования
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Действия</span>
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Действия</span>
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Действия</span>
                                </th>
                                <th scope="col" class="relative px-6 py-3">
                                    <span class="sr-only">Действия</span>
                                </th>
                            </tr>
                            </thead>

                            <tbody>

                            JOPA
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


        <div class="flex flex-col xl:hidden ">
            <div class="-my-2 overflow-x-auto sm:-mx-1 lg:-mx-8 ">
                <div class="py-2 align-middle inline-block min-w-full sm:px-1 lg:px-8">
                    <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">

                        <table class="min-w-full divide-y divide-gray-200 ">
                            <thead class="bg-gray-50">
                            <tr>
                                <th scope="col" class="px-1 py-3 text-left whitespace-wrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Название проводимого голосования
                                </th>

                            </tr>
                            </thead>

                            <tbody>
                            JOPA1
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
@endsection
