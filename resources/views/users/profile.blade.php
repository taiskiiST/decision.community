@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
])

@section('content')
    <div class="mt-10 sm:mt-0">
        @if ($errors->any())
            <div class="alert alert-danger text-red-600 p-3">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
        <form method="GET" action="@if($update) {{route('users.profile.submit.update')}} @else{{route('users.profile.update')}}@endif">
            @csrf
            <div class="md:grid md:grid-cols-6 md:gap-6">
                <div class="mt-5 md:mt-0 md:col-span-2">
                    <label class="px-4 block text-lg text-black font-semibold mt-6"> @if ($update) Изменить данные @else Данные профиля @endif</label>
                    <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                            <div class="grid grid-cols-3 gap-6">
                                <div class="col-span-3">
                                    <label for="first-name" class="block text-sm font-medium text-gray-700">ФИО</label>
                                    <input type="text" name="name" value="@if ($user){{$user->name}}@else{{old('name')}}@endif" @if (!$update) disabled @endif id="name" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('name') is-invalid @enderror" required>
                                    @error('name')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                    <input type="text" name="id" value="@if ($user){{$user->id}}@endif" hidden>
                                </div>

                                <div class="col-span-3">
                                    <label for="address" class="block text-sm font-medium text-gray-700">Адрес</label>
                                    <input type="text" name="address" value="@if ($user){{$user->address}}@else{{old('address')}} @endif" @if (!$update) disabled @endif id="address" value="х.Ленинаван, ул." autocomplete="street-address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('address') is-invalid @enderror" required>
                                    @error('address')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-span-3">
                                    <label for="phone" class="block text-sm font-medium text-gray-700">Телефон (без 8 или +7)@if ($update) - Это поле менять нельзя! В случае ошибки обратитесь к администратору.@endif </label>
                                    <input type="text" name="phone" value="@if ($user){{$user->phone}}@else{{old('phone')}} @endif" id="phone" autocomplete="phone" placeholder="9281234567" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('phone') is-invalid @enderror"
                                           disabled required>
                                    @error('phone')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-span-3">
                                    <label for="email-address" class="block text-sm font-medium text-gray-700">Электронная почта</label>
                                    <input type="email" name="email-address" value="@if ($user){{$user->email}}@else{{old('email-address')}}@endif" @if (!$update) disabled @endif id="email-address" autocomplete="email" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('email') is-invalid @enderror" >
                                    @error('email')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-span-3">
                                    <label for="job" class="block text-sm font-medium text-gray-700">Место работы</label>
                                    <input type="text" name="job" value="@if ($user){{$user->job()}}@else{{old('job')}} @endif" @if (!$update) disabled @endif  id="job" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('job') is-invalid @enderror" >
                                    @error('job')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-span-3">
                                    <label for="ownership" class="block text-sm font-medium text-gray-700">Сведения о документе, подтверждающем право собственности на помещение</label>
                                    <input type="text" name="ownership" value="@if ($user){{$user->ownership()}}@else{{old('ownership')}} @endif" @if (!$update) disabled @endif id="ownership" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('ownership') is-invalid @enderror" required>
                                    @error('ownership')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                </div>

                                <div class="col-span-3">
                                    <label for="password" class="block text-sm font-medium text-gray-700">Сменить пароль</label>
                                    <input type="text" name="password" placeholder="***********" @if(!$update) disabled @endif  id="password" value="{{ old('password') }}" autocomplete="password" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" @error('password') is-invalid @enderror @if(!$update) required @endif >
                                    @error('password')
                                    <div class="alert alert-danger">{{ $message }}</div>
                                    @enderror
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
    </div>

    <div class="inline-flex flex-row w-full place-content-between">
        <div class="px-4 py-3 sm:px-6">
            <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                @if ($update) Обновить данные профиля @else Изменить данные профиля @endif
            </button>
        </div>
        <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
            <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                    Назад
                </button></a>
        </div>
    </div>
    </form>
    </div>
@endsection

@section('scripts')
    @parent()

@endsection