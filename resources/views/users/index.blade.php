@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
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
                                                                <th scope="col" class="relative px-6 py-3 text-center">
                                                                        №
                                                                </th>
                                                                <th scope="col" class="relative px-6 py-3 text-center">
                                                                        ФИО
                                                                </th>

                                                                <th scope="col" class="relative px-6 py-3 text-center">
                                                                        Телефон
                                                                </th>
                                                                <th scope="col" class="relative px-6 py-3 text-center">
                                                                        Электронный ящик
                                                                </th>
                                                                <th scope="col" class="relative px-6 py-3 text-center">
                                                                        Должность
                                                                </th>
                                                                <th scope="col" class="relative px-6 py-3 text-center">
                                                                        Права
                                                                </th>
                                                                <th scope="col" class="relative px-6 py-3 text-center" colspan="2">
                                                                        Действия
                                                                </th>

                                                        </tr>
                                                        </thead>

                                                        <tbody>
                                                        @foreach($users as $user)
                                                                <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">
                                                                                {{ $loop->index +1 }}
                                                                        </td>
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">
                                                                                {{ $user->name }}
                                                                        </td>
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                                {{ $user->phone }}
                                                                        </td>
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                                {{ $user->email }}
                                                                        </td>
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                                {{ $user->position() }}
                                                                        </td>
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                                {{ $user->isAdmin() ? 'Администратор': '' }} @if ($user->isAdmin()) <br /> @endif
                                                                                {{ $user->isVote() ? 'Допущен к голосованию': '' }} @if ($user->isVote()) <br /> @endif
                                                                                {{ $user->isGovernance() ? 'Член правления': '' }} @if ($user->isGovernance()) <br /> @endif
                                                                                {{ $user->isManageItems() ? 'Модератор': '' }} @if ($user->isManageItems()) <br /> @endif
                                                                                {{ $user->isAccess() ? 'Допущен к сайту': '' }} @if ($user->isAccess()) <br /> @endif
                                                                        </td>
                                                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                                <form method="POST" action="{{route('user.update')}}">
                                                                                        @csrf
                                                                                        <input name="user_update" value="{{$user->id}}" type="hidden"/>
                                                                                        <a href="{{route('user.update')}}"
                                                                                           onclick="event.preventDefault();
                                                                                                this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                                                                {{ __('Редактировать') }}
                                                                                        </a>
                                                                                </form>
                                                                        </td>

                                                                        <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                                                <form method="POST" action="{{route('users.delete')}}">
                                                                                        @csrf
                                                                                        <input name="user_del" value="{{$user->id}}" type="hidden"/>
                                                                                        <a href="{{route('users.delete', ['user' => $user])}}"
                                                                                           onclick="event.preventDefault();
                                            this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                                                                {{ __('Удалить') }}
                                                                                        </a>
                                                                                </form>
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
                                <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                <table class="min-w-full divide-y divide-gray-200 ">
                                                        <thead class="bg-gray-50">
                                                        <tr>
                                                                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                        Пользователи
                                                                </th>
                                                        </tr>
                                                        </thead>

                                                        <tbody>
                                                        @foreach($users as $user)
                                                                <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                                                        <td>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center bg-gray-200">
                                                                                        {{ $user->name }}
                                                                                </div>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                                                        {{ $user->phone }}
                                                                                </div>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right bg-gray-200">
                                                                                        {{ $user->email }}
                                                                                </div>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                                                                        {{ $user->position() }}
                                                                                </div>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium bg-gray-200">
                                                                                        {{ $user->isAdmin() ? 'Администратор': '' }} @if ($user->isAdmin()) <br /> @endif
                                                                                        {{ $user->isVote() ? 'Допущен к голосованию': '' }} @if ($user->isVote()) <br /> @endif
                                                                                        {{ $user->isGovernance() ? 'Член правления': '' }} @if ($user->isGovernance()) <br /> @endif
                                                                                        {{ $user->isManageItems() ? 'Модератор': '' }} @if ($user->isManageItems()) <br /> @endif
                                                                                        {{ $user->isAccess() ? 'Допущен к сайту': '' }} @if ($user->isAccess()) <br /> @endif
                                                                                </div>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                                        <form method="POST" action="{{route('user.update')}}">
                                                                                                @csrf
                                                                                                <input name="user_update" value="{{$user->id}}" type="hidden"/>
                                                                                                <a href="{{route('user.update')}}"
                                                                                                   onclick="event.preventDefault();
                                                                                                this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                                                                        {{ __('Редактировать') }}
                                                                                                </a>
                                                                                        </form>
                                                                                </div>
                                                                                <div class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium ">
                                                                                        <form method="POST" action="{{route('users.delete')}}">
                                                                                                @csrf
                                                                                                <input name="user_del" value="{{$user->id}}" type="hidden"/>
                                                                                                <a href="{{route('users.delete', ['user' => $user])}}"
                                                                                                   onclick="event.preventDefault();
                                            this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                                                                                                        {{ __('Удалить') }}
                                                                                                </a>
                                                                                        </form>
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

                <div class="inline-flex flex-row w-full place-content-between">
                        <div class="px-4 py-3 sm:px-6">
                                <a href="{{route('users.add')}}"><button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                                        Добавить нового пользователя
                                        </button></a>
                        </div>
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