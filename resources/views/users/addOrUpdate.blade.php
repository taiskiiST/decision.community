@extends('layouts.app', [
    'headerName' => "Панель управления пользователями",
])

@section('content')
        @if ( auth()->user()->isAdmin() )
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
                <form method="POST" action="{{route('users.addOrUpdate')}}">
                        @csrf
                        <div class="md:grid md:grid-cols-6 md:gap-6">
                        <div class="mt-5 md:mt-0 md:col-span-2">
                                <label class="px-4 block text-lg text-black font-semibold mt-6"> @if ($update) Изменить нового пользователя @else Добавление нового пользователя @endif</label>
                                        <div class="shadow overflow-hidden sm:rounded-md">
                                                <div class="px-4 py-5 bg-white sm:p-6">
                                                        <div class="grid grid-cols-3 gap-6">
                                                                <div class="col-span-3">
                                                                        <label for="first-name" class="block text-sm font-medium text-gray-700">ФИО</label>
                                                                        <input type="text" name="name" value="@if ($update){{$update->name}}@else{{old('name')}}@endif" id="name" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('name') is-invalid @enderror" required>
                                                                        @error('name')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                        <input type="text" name="id" value="@if ($update){{$update->id}}@endif" hidden>
                                                                </div>

                                                                <div class="col-span-3">
                                                                        <label for="address" class="block text-sm font-medium text-gray-700">Адрес</label>
                                                                        <input type="text" name="address" value="@if ($update){{$update->address}}@else{{old('address')}} @endif" id="address" value="х.Ленинаван, ул." autocomplete="street-address" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('address') is-invalid @enderror" required>
                                                                        @error('address')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                </div>

                                                                <div class="col-span-3">
                                                                        <label for="phone" class="block text-sm font-medium text-gray-700">Телефон (без 8 или +7)@if ($update) - Это поле менять нельзя!@endif </label>
                                                                        <input type="text" name="phone" value="@if ($update){{$update->phone}}@else{{old('phone')}} @endif" id="phone" autocomplete="phone" placeholder="9281234567" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('phone') is-invalid @enderror @if ($update) disabled @endif" @if (!$update)required @endif>
                                                                        @error('phone')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                </div>

                                                                <div class="col-span-3">
                                                                        <label for="email-address" class="block text-sm font-medium text-gray-700">Электронная почта</label>
                                                                        <input type="email" name="email-address" value="@if ($update){{$update->email}}@else{{old('email-address')}}@endif" id="email-address" autocomplete="email" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('email') is-invalid @enderror " >
                                                                        @error('email')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                </div>


                                                                <div class="col-span-3">
                                                                        <label for="job" class="block text-sm font-medium text-gray-700">Место работы</label>
                                                                        <input type="text" name="job" value="@if ($update){{$update->job()}}@else{{old('job')}} @endif"  id="job" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('job') is-invalid @enderror" >
                                                                        @error('job')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                </div>

                                                                <div class="col-span-3">
                                                                        <label for="ownership" class="block text-sm font-medium text-gray-700">Сведения о документе, подтверждающем право собственности на помещение</label>
                                                                        <input type="text" name="ownership" value="@if ($update){{$update->ownership()}}@else{{old('ownership')}} @endif" id="ownership" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('ownership') is-invalid @enderror" >
                                                                        @error('ownership')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                </div>

                                                                @if(auth()->user()->isSuperAdmin())
                                                                <div class="col-span-3">
                                                                        <label for="company" class="block text-sm font-medium text-gray-700">Площадка принятия решений организации:</label>
                                                                        <select type="text" name="company" id="company" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md @error('company') is-invalid @enderror">
                                                                        @foreach ($companies as $company)
                                                                                        @if ($update)
                                                                                                <option @if ($company->id == $update->company_id) selected @endif value="{{$company->id}}">{{$company->title}}</option>
                                                                                        @else
                                                                                                <option value="{{$company->id}}">{{$company->title}}</option>
                                                                                        @endif
                                                                        @endforeach
                                                                        </select>
                                                                        @error('company')
                                                                        <div class="alert alert-danger">{{ $message }}</div>
                                                                        @enderror
                                                                </div>
                                                                @endif


                                                                <div class="col-span-3">
                                                                        <label for="permission" class="block text-sm font-medium text-gray-700">Права</label>
                                                                        <select id="permission" name="permission[]" onchange="CheckGovernance(this)" multiple="multiple" autocomplete="permission" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-28" required>
                                                                                @foreach ($permissions as $permission_arr)
                                                                                        @foreach ($permission_arr as $key => $permission)
                                                                                                @if ( $update )
                                                                                                        @if ( $update->isHavePermission($key) )
                                                                                                                <option value="{{$key}}" selected>{{$permission}}</option>
                                                                                                        @else
                                                                                                                <option value="{{$key}}">{{$permission}}</option>
                                                                                                        @endif
                                                                                                @else
                                                                                                        <option value="{{$key}}">{{$permission}}</option>
                                                                                                @endif
                                                                                        @endforeach
                                                                                @endforeach
                                                                        </select>
                                                                </div>

                                                                <div id="hidden_element" class="col-span-3  @if ( $update ) @if ( $update->isHavePermission('governance') )  @else hidden @endif @else hidden @endif ">
                                                                        <label for="position" class="block text-sm font-medium text-gray-700">Должность</label>

                                                                        <select name="position" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">

                                                                                @foreach($positions as $key => $position)
                                                                                        @if ($update)
                                                                                                @if ($position->position == $update->position())
                                                                                                        <option value="{{$position->id}}" selected>{{$position->position}}</option>
                                                                                                @else
                                                                                                        <option value="{{$position->id}}">{{$position->position}}</option>
                                                                                                @endif
                                                                                        @else
                                                                                                <option value="{{$position->id}}">{{$position->position}}</option>
                                                                                        @endif
                                                                                @endforeach
                                                                        </select>
                                                                </div>

                                                                <div class="col-span-3">
                                                                        <label for="password" class="block text-sm font-medium text-gray-700">Пароль</label>
                                                                        <input type="text" name="password" @if ($update) placeholder="***********" @endif id="password" value="{{ old('password') }}" autocomplete="password" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" @error('password') is-invalid @enderror @if (!$update) required @endif >
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
                                        @if ($update) Изменить нового пользователя @else Добавить нового пользователя @endif
                                </button>
                        </div>
                        <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                                <a href="/manage/users"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                                                Назад
                                        </button></a>
                        </div>
                </div>
        </form>
        </div>
        @else
                <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        <span class="block">Для доступа к этой странице нужно обладать правами администратора!</span>
                        <span class="block text-indigo-600">За вами уже выехали.</span>
                </h2>
        @endif
@endsection

@section('scripts')
    @parent()
    <script
            src="https://code.jquery.com/jquery-2.2.4.min.js"
            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossorigin="anonymous"></script>
    <script>
        function CheckGovernance(selectObject){
                var value = selectObject.value;
                if (value == 'governance' && $('#hidden_element').hasClass('hidden')){
                        $('#hidden_element').removeClass('hidden')
                }else if((value == 'governance' && !$('#hidden_element').hasClass('hidden'))){
                        $('#hidden_element').addClass('hidden')
                }else{
                        $('#hidden_element').addClass('hidden')
                }

        }
    </script>
@endsection