<nav class="bg-gradient-to-l from-gray-900 via-blue-900 to-indigo-900">
    <div class="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <div class="flex items-center">
                <div class="flex-shrink-0">
{{--                    <a href="{{route('poll.questions.view_public_questions')}}">--}}
                        <img class="h-10 w-10" src="/images/logo.png" alt="Workflow logo">
{{--                    </a>--}}
                </div>

                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
{{--                        <a href="{{ route('items.index') }}" class="nav-tab {{ in_array($currentRouteName, ['items.index']) ? 'nav-tab-current' : 'nav-tab-not-current'}}" >Каталог товаров и услуг ТСН "КП Березка"</a>--}}

{{--                        <a href="/polls" class="nav-tab {{ in_array($currentRouteName, ['polls.index']) ? 'nav-tab-current' : 'nav-tab-not-current'}}">Голосования</a>--}}

{{--                        @if (auth()->user()->canManageItems())--}}
{{--                            <a href="{{ route('items-tree') }}" class="nav-tab {{ $currentRouteName === 'items-tree' ? 'nav-tab-current' : 'nav-tab-not-current'}}">Управление</a>--}}
{{--                        @endif--}}

{{--                        @if (auth()->user()->isAdmin())--}}
{{--                            <a href="{{ route('users.governance') }}" class="nav-tab {{ $currentRouteName === 'users.governance' ? 'nav-tab-current' : 'nav-tab-not-current'}}">Органы управления и надзора</a>--}}
{{--                            <a href="{{ route('users.manage') }}" class="nav-tab {{ $currentRouteName === 'users.manage' ? 'nav-tab-current' : 'nav-tab-not-current'}}">Пользователи</a>--}}
{{--                        @endif--}}

                        <div id="searchQuestionsFullScreen"></div>


{{--                        <div class="flex flex-col">--}}
{{--                            <div class="text-base font-medium leading-none text-white">Долг: 1 000 руб</div>--}}
{{--                            <div class="text-sm font-medium leading-none text-gray-400 mt-1">Оплатить</div>--}}
{{--                        </div>--}}
                    </div>
                </div>
            </div>

{{--            <div class="hidden md:block">--}}
{{--                <div class="ml-4 flex items-center md:ml-6">--}}

{{--                    <div class="flex flex-col pl-5">--}}
{{--                        <form method="POST" action="{{ route('logout') }}">--}}
{{--                            @csrf--}}
{{--                            <input name="uri_poll" value="/login" type="hidden"/>--}}
{{--                            <a href="route('logout')"--}}
{{--                               onclick="event.preventDefault();--}}
{{--                                                    this.closest('form').submit();" class="text-base font-medium leading-none text-white">--}}
{{--                                {{ __('Выйти') }}--}}
{{--                            </a>--}}
{{--                        </form>--}}
{{--                    </div>--}}
{{--                </div>--}}

{{--            </div>--}}
            @if (auth()->user()->canVote())
            <div class="hidden md:hidden xl:inline-flex">
                <div class="items-baseline space-x-4 text-center mt-3">
                    <div class="text-base font-medium leading-none text-white">{{ auth()->user()->name }}</div>
                    <div class="text-sm font-medium leading-none text-gray-400 mt-1">{{ auth()->user()->address }}, {{ auth()->user()->email }}</div>
                </div>
                <div>
                    <form method="POST" action="{{route('poll.create',['type_of_poll' => \App\Models\TypeOfPoll::SUGGESTED_POLL])}}">
                        @csrf
                        <a href="#"
                           onclick="event.preventDefault();
                                                            this.closest('form').submit();"
                           class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            {{ __('Предложить вопрос к рассмотрению') }}
                        </a>
                    </form>
                </div>
            </div>
            <div class="xl:hidden">
                <div>
                    <form method="POST" action="{{route('poll.create',['type_of_poll' => \App\Models\TypeOfPoll::SUGGESTED_POLL])}}">
                        @csrf
                        <a href="#"
                           onclick="event.preventDefault();
                                                        this.closest('form').submit();"
                           class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                            {{ __('Вопрос к рассмотрению') }}
                        </a>
                    </form>
                </div>
            </div>
            @endif
            <div class="hidden md:hidden xl:inline-flex">
                <div>
                    <a href="{{route('poll.questions.view_suggested_questions')}}" class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Список предложенных вопросов
                    </a>
                </div>
            </div>

            <div class="xl:hidden">
                <div>
                    <a href="{{route('poll.questions.view_suggested_questions')}}" class="w-100 mt-2 ml-2 flex items-center justify-center p-2 border border-transparent text-base text-center font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                        Предложенные вопросы
                    </a>
                </div>
            </div>

            <div class="-mr-2 flex  space-x-4">
                <div class="relative w-60  md:hidden">
                    <div id="searchQuestionsSmallScreen"></div>
                </div>
                <!-- Mobile menu button -->
                <button
                    onClick="toggleMenu()"
                    class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white">
                    <!-- Menu open: "hidden", Menu closed: "block" -->
                    <div class="block h-6 w-6 hamburger"><svg stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg></div>
                    <!-- Menu open: "block", Menu closed: "hidden" -->
                    <div class="hidden h-6 w-6 cross"><svg stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg></div>
                </button>
            </div>
        </div>
    </div>

    <!--
      Mobile menu, toggle classes based on menu state.

      Open: "block", closed: "hidden"
    -->
    <div class="hidden menu_dropdown">
        <div class="pt-4 pb-3 border-t border-gray-700">
            <a href="{{route('users.profile')}}" class="nav-menu-link nav-menu-link-not-current">
            <div class="flex items-center px-5 space-x-3">
                <div class="flex-shrink-0 text-white">
                    <svg class="w-10 h-10" enable-background="new 0 0 48 48" id="Layer_1" version="1.1" viewBox="0 0 48 48" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path clip-rule="evenodd" d="M24,45C12.402,45,3,35.598,3,24S12.402,3,24,3s21,9.402,21,21S35.598,45,24,45z   M35.633,39c-0.157-0.231-0.355-0.518-0.514-0.742c-0.277-0.394-0.554-0.788-0.802-1.178C34.305,37.062,32.935,35.224,28,35  c-1.717,0-2.965-1.288-2.968-3.066L25,31c0-0.135-0.016,0.148,0,0v-1l1-1c0.731-0.339,1.66-0.909,2.395-1.464l0.135-0.093  C29.111,27.074,29.923,26.297,30,26l0.036-0.381C30.409,23.696,31,20.198,31,19c0-4.71-2.29-7-7-7c-4.775,0-7,2.224-7,7  c0,1.23,0.591,4.711,0.963,6.616l0.035,0.352c0.063,0.313,0.799,1.054,1.449,1.462l0.098,0.062C20.333,28.043,21.275,28.657,22,29  l1,1v1c0.014,0.138,0-0.146,0,0l-0.033,0.934c0,1.775-1.246,3.064-2.883,3.064c-0.001,0-0.002,0-0.003,0  c-4.956,0.201-6.393,2.077-6.395,2.077c-0.252,0.396-0.528,0.789-0.807,1.184c-0.157,0.224-0.355,0.51-0.513,0.741  c3.217,2.498,7.245,4,11.633,4S32.416,41.498,35.633,39z M24,5C13.507,5,5,13.507,5,24c0,5.386,2.25,10.237,5.85,13.694  C11.232,37.129,11.64,36.565,12,36c0,0,1.67-2.743,8-3c0.645,0,0.967-0.422,0.967-1.066h0.001C20.967,31.413,20.967,31,20.967,31  c0-0.13-0.021-0.247-0.027-0.373c-0.724-0.342-1.564-0.814-2.539-1.494c0,0-2.4-1.476-2.4-3.133c0,0-1-5.116-1-7  c0-4.644,1.986-9,9-9c6.92,0,9,4.356,9,9c0,1.838-1,7-1,7c0,1.611-2.4,3.133-2.4,3.133c-0.955,0.721-1.801,1.202-2.543,1.546  c-0.005,0.109-0.023,0.209-0.023,0.321c0,0-0.001,0.413-0.001,0.934h0.001C27.033,32.578,27.355,33,28,33c6.424,0.288,8,3,8,3  c0.36,0.565,0.767,1.129,1.149,1.694C40.749,34.237,43,29.386,43,24C43,13.507,34.493,5,24,5z"
                              fill="white"
                              stroke="currentColor"
                        />
                    </svg>
                </div>

                <div class="space-y-1">
                    <div class="text-base font-medium leading-none text-white text-wrap">{{ auth()->user()->name }} <b>(личный кабинет)</b></div>

                    <div class="text-sm font-medium leading-none text-gray-400">{{ auth()->user()->email }}</div>
                </div>
            </div>
            </a>
        </div>
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <p class="nav-menu-link text-white font-medium">Товары и услуги</p>
                <div class="flex flex-col pl-5">
                    <a href="{{ route('items.index') }}" class="nav-menu-link {{ in_array($currentRouteName, ['items.index']) ? 'nav-menu-link-current' : 'nav-menu-link-not-current'}}">Товары и услуги</a>
                </div>
            @if (auth()->user()->isAdmin())
                <div class="flex flex-col pl-5">
                    <a href="{{ route('items-tree') }}" class="nav-tab {{ $currentRouteName === 'items-tree' ? 'nav-tab-current' : 'nav-tab-not-current'}}">Редактор товаров и услуг</a>
                </div>
            @endif
                <p class="nav-menu-link  text-white font-medium">Голосование и документы</p>
            <div class="flex flex-col pl-5">
                <a href="/polls" class="nav-tab {{ in_array($currentRouteName, ['polls.index']) ? 'nav-tab-current' : 'nav-tab-not-current'}}">Голосования</a>
            </div>
            <div class="flex flex-col pl-5">
                <a href="/polls/view/public/questions/" class="nav-tab {{ in_array($currentRouteName, ['poll.questions.view_public_questions']) ? 'nav-tab-current' : 'nav-tab-not-current'}}">Публичные вопросы</a>
            </div>
            @if (auth()->user()->canVote())
            <div class="flex flex-col pl-5 xl:hidden">
                <a href="{{route('polls.create',['type_of_poll' =>  \App\Models\TypeOfPoll::SUGGESTED_POLL ])}}" class="nav-tab {{ in_array($currentRouteName, ['polls.create']) ? 'nav-tab-current' : 'nav-tab-not-current'}}">
                    Предложить вопрос к рассмотрению
                </a>
            </div>
            @endif
            <div class="flex flex-col pl-5 xl:hidden">
                <a href="{{route('poll.questions.view_suggested_questions')}}" class="nav-tab {{ in_array($currentRouteName, ['poll.questions.view_suggested_questions']) ? 'nav-tab-current' : 'nav-tab-not-current'}}">
                    Список предложенных вопросов
                </a>
            </div>
            @if (auth()->user()->isAdmin())
                <p class="nav-menu-link  text-white font-medium">Администрирование</p>
                <div class="flex flex-col pl-5">
                    <a href="{{ route('users.governance') }}" class="nav-tab {{ $currentRouteName === 'users.governance' ? 'nav-tab-current' : 'nav-tab-not-current'}}">Органы управления и надзора</a>
                </div>
                <div class="flex flex-col pl-5">
                    <a href="{{ route('users.manage') }}" class="nav-tab {{ $currentRouteName === 'users.manage' ? 'nav-tab-current' : 'nav-tab-not-current'}}">Пользователи</a>
                </div>
            @endif

                {!! Form::open(['route' => ['logout'], 'method' => 'POST']) !!}
                <input name="uri_poll" value="/login" type="hidden"/>
                <a href="route('logout')"
                   onclick="event.preventDefault();
                            this.closest('form').submit();" class="nav-tab nav-tab-not-current">
                    {{ __('Выйти') }}
                </a>
                {!! Form::close() !!}
        </div>
    </div>
</nav>

@section('scripts')
    @parent()

    <script src="{!! mix('/js/GlobalSearchQuestions.js') !!}"></script>
    <script src="{!! mix('/js/GlobalSearchQuestionsSmallScreen.js') !!}"></script>
    <script>
        function toggleMenu() {
            if (document.getElementsByClassName("block h-6 w-6 hamburger").length >0 ){
                var ex_class;
                for (ex_class of document.getElementsByClassName("block h-6 w-6 hamburger")) {
                    ex_class.className = "hidden h-6 w-6 hamburger";
                }
            }else{
                var ex_class;
                for (ex_class of document.getElementsByClassName("hidden h-6 w-6 hamburger")) {
                    ex_class.className = "block h-6 w-6 hamburger";
                }
            }
            if (document.getElementsByClassName("block h-6 w-6 cross").length >0 ){
                var ex_class;
                for (ex_class of document.getElementsByClassName("block h-6 w-6 cross")) {
                    ex_class.className = "hidden h-6 w-6 cross";
                }
            }else{
                var ex_class;
                for (ex_class of document.getElementsByClassName("hidden h-6 w-6 cross")) {
                    ex_class.className = "block h-6 w-6 cross";
                }
            }

            if (document.getElementsByClassName("hidden menu_dropdown").length >0 ){
                var ex_class;
                for (ex_class of document.getElementsByClassName("hidden menu_dropdown")) {
                    ex_class.className = "block menu_dropdown";
                }
            }else{
                var ex_class;
                for (ex_class of document.getElementsByClassName("block menu_dropdown")) {
                    ex_class.className = "hidden menu_dropdown";
                }
            }

        }

    </script>
@endsection
