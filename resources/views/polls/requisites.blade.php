@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    <div class="mt-10 sm:mt-0">
        <div class="p-3 md:col-span-2">
            <div>
                <div>
                    <label class="px-1 py-4 block text-lg text-black font-semibold text-wrap">Обновление основных реквизитов опроса</label>
                </div>

                <div id="StartEndPoll"></div>



                <div class="px-1 py-4 sm:px-6 ">
                    <label class="px-1 py-4 block text-xl text-black font-semibold text-wrap">Выберите формат под протокол</label>
                    <select name="form_protocol"
                            class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required>
                        <option value="1" selected>Ведение протокола не требуется</option>
                        <option value="2">Очная форма</option>
                        <option value="3">Очно-заочная форма</option>
                        <option value="4">Заочная форма</option>
                    </select>
                </div>


                <div class="px-1 py-4 sm:px-6 ">
                 @if ($poll->start)
                    @if ($poll->potential_voters_number)
                        <div class="inline-flex flex-row w-full place-content-between">
                            <div class="px-1 py-3 sm:px-6">
                                <label class="px-1 py-4 block text-lg text-black text-wrap">Зарегистрировано {{$poll->potential_voters_number}} членов {{$_ENV['APP_NAME']}}</label>
                            </div>
                        </div>
                    @endif
                 @else
                        <form method="POST" action="{{ route('poll.start',[$poll->id,0]) }}">
                            @csrf
                            @method('PATCH')
                            <input name="start" value="{{$poll->id}}" type="hidden"/>
                            <button type="submit"
                                    class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                {{ __('Начать голосование') }}
                            </button>
                        </form>
                 @endif
                </div>

                <table>
                @if (!$poll->blank_with_answers_doc)
                    <tr>
                        <div class="px-1 py-4 sm:px-6 flex-row-reverse ">
                            <form method="POST" action="{{route('poll.generateBlankWithAnswers',['poll'=>$poll])}}">
                                @csrf
                                <button type="submit" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                                    {{ __('Сгенерировать бланк с ответами') }}
                                </button>
                            </form>
                        </div>
                    </tr>
                @else
                    <tr>
                        <td>
                            <div class="px-1 py-4 sm:px-1 flex-row-reverse ">
                                <a href="{{Storage::url($poll->blank_with_answers_doc)}}" target="_blank">
                                    <button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                                        {{ __('Скачать бланк с ответами в Ворде') }}
                                    </button>
                                </a>
                            </div>
                        </td>
                        <td>
                            <div class="px-1 py-1 sm:px-1 flex-row-reverse ">
                                <form method="POST" action="{{ route('poll.generateBlankWithAnswers',['poll' => $poll] ) }}" name="blank">
                                    @csrf
                                    <button type="submit" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                                        {{ __('Обновить бланк с ответами в Ворде') }}
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                @endif
                @if ($poll->finished)
                    @if (!$poll->protocol_doc)
                        <tr>
                            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                                <form method="POST" action="{{route('poll.generateProtocol',['poll'=>$poll])}}">
                                    @csrf
                                    <button type="submit" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                                        {{ __('Сгенерировать протокол') }}
                                    </button>
                                </form>
                            </div>
                        </tr>
                    @else
                        <tr>
                            <td>
                                <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                                    <a href="{{Storage::url($poll->protocol_doc)}}" target="_blank">
                                        <button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                                            {{ __('Скачать протокол в Ворде') }}
                                        </button>
                                    </a>
                                </div>
                            </td>
                            <td>
                                <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                                    <form method="POST" action="{{route('poll.generateProtocol',['poll'=>$poll])}}">
                                        @csrf
                                        <button type="submit" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                                            {{ __('Обновить протокол') }}
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @endif
                @endif

                </table>
            </div>


            <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
                <form method="GET" action="{{route('poll.requisites.submitName',['poll'=>$poll->id])}}" class="inline-flex flex-col" name="pollName" id="pollName">
                    @csrf
                    <div class="px-1 py-1 bg-white sm:p-6">
                        <div class="col-span-6 sm:col-span-3">
                            <label for="position" class="block text-sm font-medium text-gray-700">Введите название голосования</label>
                            <input type="text" name="poll_name" value="{{$poll->name}}" id="poll" autocomplete="poll" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" required>
                            <input type="text" name="poll_id" value="{{$poll->id}}" class="hidden">
                        </div>
                        <button type="submit" form="pollName"
                                class="mt-1 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                            Обновления названия голосования
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div class="mt-10 sm:mt-0">
            <div class="p-3 md:col-span-2">
                @if($errors->any())
                    <div class="alert-danger">
                        <ul>
                            @foreach($errors->all() as $error)
                                <li>
                                    <b><p style="color: red">{{$error}} </p></b>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                @endif
                <form method="GET" action="{{route('poll.requisites.submitOrganizers',['poll'=>$poll->id])}}" name="organizers" id="organizers">
                    @csrf
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                        <div>
                            <div>Председатель собрания</div>
                            <div>
                                <select name="chairman"
                                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required>
                                    @foreach($users as $user)

                                            @if(!empty($organizers) && $user->id == $organizers->user_chairman_id)
                                                <option value="{{$user->id}}" selected>{{$user->name}}</option>
                                            @else
                                                <option value="{{$user->id}}">{{$user->name}}</option>
                                            @endif
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>Секретарь собрания</div>
                            <div>
                                <select name="secretary"
                                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required>
                                    @foreach($users as $user)
                                        @if(!empty($organizers) && $user->id == $organizers->user_secretary_id)
                                            <option value="{{$user->id}}" selected>{{$user->name}}</option>
                                        @else
                                            <option value="{{$user->id}}">{{$user->name}}</option>
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                        </div>
                        <div>
                            <div>Ответственный за подсчет голосов</div>
                            <div>
                                <select name="counter_votes"
                                        class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required>
                                    @foreach($users as $user)
                                        @if(!empty($organizers) && $user->id == $organizers->user_counter_votes_id)
                                            <option value="{{$user->id}}" selected>{{$user->name}}</option>
                                        @else
                                            <option value="{{$user->id}}">{{$user->name}}</option>
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="inline-flex flex-row w-full place-content-between">
                        <div class="px-4 py-3 bg-gray-50  sm:px-6">
                            <button type="submit" form="organizers"
                                    class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                                Сохранить организаторов собрания
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

        <div class="mt-10 sm:mt-0">
            <div class="p-3 md:col-span-2">
                <form method="GET" action="{{route('poll.requisites.SubmitInvited',['poll'=>$poll->id])}}" name="invited" id="invited">
                    @csrf
                    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                        <div>
                            <div>Приглашенные</div>
                            <div>
                                <select name="invited[]"
                                        class="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required multiple>
                                    @foreach($users as $user)
                                        @if(!$user->isVote() && $user->isAccess() )
                                            @if(!empty($organizers) && $organizers->isInvited($user->id))
                                                <option value="{{$user->id}}" selected>{{$user->name}}</option>
                                            @else
                                                <option value="{{$user->id}}">{{$user->name}}</option>
                                            @endif
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="inline-flex flex-row w-full place-content-between">
                        <div class="px-4 py-1 bg-gray-50  sm:px-6">
                            <button type="submit" form="invited"
                                    class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 submit-button">
                                Сохранить приглашенных
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>

        <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
            <a href="/polls/{{$poll->id}}/edit">
                <button type="button"
                        class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Назад к опросу
                </button>
            </a>
        </div>
    </div>
    </div>
@endsection

@section('scripts')
    @parent()
    <script src="{!! mix('/js/StartEndPoll.js') !!}"></script>
@endsection
