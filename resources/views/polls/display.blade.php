@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('styles')
    @parent

    <style>
        a {
            text-decoration: none;
            color:blue
        }
        ul {
            padding:0;
            list-style: none;
        }
        ul li{

            padding:6px;
        }
        ul li:before {
            padding-right:10px;
            font-weight: bold;
            color: #C0C0C0;
            content: "\2714";
            transition-duration: 0.5s;
        }
        ul li:hover:before {
            color: #337AB7;
            content: "\2714";
        }
    </style>
@endsection


@section('content')
    @if($errors->any() && !$displayMode)
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

    @if (auth()->user() ? auth() && auth()->user()->canVote()|| auth()->user()->isAccess() : '' )
        @if (auth()->user()->isAccess() || (!$poll->finished && !$poll->authUserVote() && !$poll->isGovernanceMeetingTSN() || $displayMode) || $poll->isGovernanceMeetingTSN() && auth()->user()->isGovernance() )

            {!! Form::open(['route' => ['poll.submit', ['poll' => $poll] ], 'method' => 'POST']) !!}

            <!-- This example requires Tailwind CSS v2.0+ -->
{{--            @if ($quorum)--}}
{{--                <div class="inline-flex flex-row w-full place-content-between">--}}
{{--                    <div class="px-1 py-3 sm:px-6">--}}
{{--                        <label class="px-1 py-4 block text-lg text-black text-wrap">Зарегистрировано {{$quorum->count_of_voting_current}} из {{$quorum->all_users_that_can_vote}} членов ТСН <p class="font-semibold"> @if( ( round($quorum->all_users_that_can_vote/2,0,PHP_ROUND_HALF_UP) ) <= $quorum->count_of_voting_current)Кворум есть! @else Кворума нет! @endif </p></label>--}}
{{--                    </div>--}}
{{--                </div>--}}
{{--            @endif--}}
            <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div class="text-center"><span style="font-size: x-large;"><b>{{$poll->name}}</b></span></div>

                <br/>

                <!-- This example requires Tailwind CSS v2.0+ -->
                <nav class="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
                    <div class="-mt-px w-0 flex-1 flex">
                        <button class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 prev hidden outline-none focus:outline-none" type="button">
                            <!-- Heroicon name: solid/arrow-narrow-left -->
                            <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                            </svg>
                            Предыдущий
                        </button>
                    </div>
                    <div class="flex">
                        @foreach($poll->questions as $question)
                            <button id="nav_{!! $question->id !!}" class="{!! $loop->first ? 'border-indigo-500 text-indigo-600 class_'.$question->id : 'hidden class_'.$question->id !!} border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none" type="button" name="nav_loop_{!! $loop->index + 1 !!}">
                                {!! $loop->index + 1 !!} <span > / {!! $loop->count !!} </span>
                            </button>
                        @endforeach
                    </div>

                    <div class="-mt-px w-0 flex-1 flex justify-end">
                        <button class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none" value="{{$poll->questions->count()}}" type="button">
                            Следующий
                            <!-- Heroicon name: solid/arrow-narrow-right -->
                            <svg class="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </nav>

                @foreach($poll->questions as $question)
                    @if (auth()->user()->isAdmin())
                        <div class="mt-10 sm:mt-0 {!! $loop->first ? '' : 'hidden' !!}" id="speaker_question_{!! $question->id !!}">
                            <div class="p-3 md:col-span-2">
                                <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5">
                                    <div>
                                        <div>Выступающие</div>
                                        <div>
                                            <select name="speakers{!! $question->id !!}[]"
                                                    class="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required multiple
                                                    id="select_speaker_question_{!! $question->id !!} ">
                                                @foreach($users as $user)

                                                    @if(($question->speakers()->count() > 0 ) && in_array($user->id, explode(',',$question->speakers()->first()->users_speaker_id) )  )
                                                        <option value="{{$user->id}}" selected>{{$user->name}}</option>
                                                    @else
                                                        <option value="{{$user->id}}">{{$user->name}}</option>
                                                    @endif
                                                @endforeach
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endif

                    <div class="bg-white shadow overflow-hidden sm:rounded-lg {!! $loop->first ? '' : 'hidden' !!}" id="question_{!! $question->id !!}">
                        <div class="px-4 py-5 sm:px-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">
                                {{$loop->index + 1}}) {!! $question->text !!}
                            </h3>
                        </div>
                        <div class="px-4 py-5 sm:px-6">
                            <h3 class="text-lg leading-6 font-medium text-gray-900">
                                @foreach($question->question_files as $file)
                                    <p class="@if (!$loop->first) pt-10 @endif">Описание: {{$file->text_for_file}}</p>
                                    @if (strpos($file->path_to_file, '.pdf') === false)
                                    @else

                                        <object data="{{Storage::url($file->path_to_file) }}" type="application/pdf" width="100%" class="lg:h-96 xl:h-96 2xl:h-96">
                                            <div id="pdf-main-container-{{$file->id}}" >
                                                <button id="show-pdf-button-{{$file->id}}" value="{{Storage::url($file->path_to_file)}}" lang="{{$file->id}}" class="hidden files_pdf">Show PDF</button>
                                                <div id="pdf-loader-{{$file->id}}">Загружается...</div>
                                                <div id="pdf-contents-{{$file->id}}">
                                                    <div id="pdf-meta-{{$file->id}}">
                                                        <div class="inline-flex flex-row w-full place-content-between">
                                                            <div class="py-3">
                                                                <button id="pdf-prev-{{$file->id}}" lang="{{$file->id}}" value="{{Storage::url($file->path_to_file)}}" onclick="clickPrev({{$file->id}})" class="pdf-prev mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Назад</button>
                                                                <button id="pdf-next-{{$file->id}}" lang="{{$file->id}}" value="{{Storage::url($file->path_to_file)}}" onclick="clickNext({{$file->id}})" class="pdf-next mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Вперед</button>
                                                            </div>
                                                            <div class="px-1 py-7 sm:px-6 flex-row-reverse ">
                                                                <div id="page-count-container-{{$file->id}}" class="inline-flex">Страница&nbsp;<div id="pdf-current-page-{{$file->id}}"></div>/<div id="pdf-total-pages-{{$file->id}}"></div></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div id="div_canvas-{{$file->id}}" style="width:100%;height:500px;overflow-x:scroll;overflow-y:scroll;">
                                                        <canvas id="pdf-canvas-{{$file->id}}" class="w-full" style="min-width:500px;"></canvas>
                                                    </div>
                                                    <div id="page-loader-{{$file->id}}">Загружается страница...</div>
                                                </div>
                                                <button id="download_file_{{$file->id}}"><a href="{{Storage::url($file->path_to_file)}}" target="_blank" class="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Открыть в отдельном окне</a></button>
                                            </div>
                                        </object>
                                    @endif
                                    @if (preg_match('/\.jpg|\.png/', $file->path_to_file) )
                                        <img src={{Storage::url($file->path_to_file)}} />
                                    @endif
                                    @if (preg_match('/\.jpg|\.png|\.pdf/', $file->path_to_file) )
                                    @else
                                        <a href={{Storage::url($file->path_to_file)}} target="_blank" className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300">Скачать</a>
                                    @endif
                                @endforeach
                            </h3>
                        </div>
                        @if (!$displayMode && auth()->user()->canVote() )
                        <div>
                            <fieldset>
                                <div class="bg-white rounded-md -space-y-px">
                                @foreach($question->answers as $answer)
                                    <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
                                        <label class="border-gray-200 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer">
                                            <input type="radio" name="question_{{$question->id}}" value="{{ $answer->id }}" class="h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500 input-radio" aria-labelledby="privacy-setting-0-label" aria-describedby="privacy-setting-0-description" {{ old('question_'.$question->id) ? 'checked': '' }}">

                                            <div class="ml-3 flex flex-col">
                                                <!-- Checked: "text-indigo-900", Not Checked: "text-gray-900" -->
                                                <span id="privacy-setting-0-label" class="text-gray-900 block text-sm font-medium">
                                                    {{ $answer->text  }}
                                                </span>
                                            </div>
                                        </label>
                                    @endforeach
                                </div>
                            </fieldset>
                        </div>
                        @endif
                    </div>
                @endforeach
                <br />
            <!-- This example requires Tailwind CSS v2.0+ -->
                <nav class="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
                    <div class="-mt-px w-0 flex-1 flex">
                        <button class="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 prev hidden outline-none focus:outline-none" type="button">
                            <!-- Heroicon name: solid/arrow-narrow-left -->
                            <svg class="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                            </svg>
                            Предыдущий
                        </button>
                    </div>
                    <div class="flex">
                        @foreach($poll->questions as $question)
                            <button id="nav_{!! $question->id !!}" class="{!! $loop->first ? 'border-indigo-500 text-indigo-600 class_'.$question->id : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 md,lg,2xl,xl,sm:-mt-px hidden class_'.$question->id !!} border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none" type="button" name="nav_loop_{!! $loop->index + 1 !!}">
                                {!! $loop->index + 1 !!} <span > / {!! $loop->count !!} </span>
                            </button>
                        @endforeach
                    </div>

                    <div class="-mt-px w-0 flex-1 flex justify-end">
                        <button class="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 next outline-none focus:outline-none" value="{{$poll->questions->count()}}" type="button">
                            Следующий
                            <!-- Heroicon name: solid/arrow-narrow-right -->
                            <svg class="ml-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </nav>



                <div class="inline-flex flex-row w-full place-content-between">
                    <div class="px-4 py-3 sm:px-6">
                        <button type="button" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hidden submit-button"
                       id="button_submit">
                            Проголосовать!
                        </button>
                    </div>
                    <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                        <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        id="button_cancel">
                               @if ($displayMode || !auth()->user()->isAccess()) Назад @else Отмена @endif
                            </button></a>
                    </div>
                </div>
            </div>
            {!! Form::close() !!}
        @else
            @if ($poll->isGovernanceMeetingTSN() && !auth()->user()->isGovernance())
                <div class="bg-gray-50">
                    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            <span class="block">Голосование '{{$poll->name}}' доступно только для членов Правления ТСН!</span>
                            <span class="block text-indigo-600">С результатами голосования можно ознакомиться нажав на кнопку.</span>
                        </h2>
                        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div class="inline-flex rounded-md shadow">
                                <a href="{{route('poll.results',[$poll->id])}}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Ознакомиться с результатами голосования
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @else
                <!-- This example requires Tailwind CSS v2.0+ -->
                <div class="bg-gray-50">
                    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                        @if ($poll->finished)
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                <span class="block">Голосование '{{$poll->name}}' окончено!</span>
                                <span class="block text-indigo-600">Данный опрос окончен, с его результатами можно ознакомиться нажав на кнопку.</span>
                            </h2>
                        @else
                            <h2 class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                                <span class="block">Вы уже голосовали по опросу '{{$poll->name}}'!</span>
                                <span class="block text-indigo-600">С результатами голосования можно ознакомиться нажав на кнопку.</span>
                            </h2>
                        @endif
                        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div class="inline-flex rounded-md shadow">
                                <a href="{{route('poll.results',[$poll->id])}}" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                                    Ознакомиться с результатами голосования
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            @endif
        @endif
    @endif


    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.min.js"></script>
    <script>
        var _PDF_DOC = [],
            _CURRENT_PAGE = [],
            _TOTAL_PAGES = [],
            _PAGE_RENDERING_IN_PROGRESS = [],
            _CANVAS = []

        $("#button_submit").click(
            function () {
                if (confirm('Вы `уверены`? Ответы нельзя будет изменить впоследствии.')){
                    $("#button_submit").addClass("submit_done");
                    $('#button_submit').prop('type', 'submit');
                    $("#button_submit").submit();
                }else{
                    $("#button_submit").addClass("submit_no");
                }
                return true
            }
        );

        window.addEventListener('beforeunload', function () {
            if (document.location.pathname.includes("display") ) {
                if (!$("#button_submit").hasClass('submit_done') && !$("#button_submit").hasClass('submit_no')) {
                    // Отменяем поведение по умолчанию
                    event.preventDefault()

                    // Chrome требует наличия returnValue
                    event.returnValue = ''
                }
                if ($("#button_submit").hasClass('submit_no')) {
                    // Отменяем поведение по умолчанию
                    event.preventDefault()

                    // Chrome требует наличия returnValue
                    event.returnValue = ''
                    $("#button_submit").removeClass("submit_no");
                }
            }

        })

        $("#button_cancel").click(
            function () {
                //console.log(document.location.pathname.includes("display"));
                if (document.location.pathname.includes("display")) {
                    return confirm('Вы уверены что хотите прервать голосование? В этом случае ваш голос не будет зачтен!')
                }
            }
        );

        function clickNext(file_id){
            if(_CURRENT_PAGE[file_id] != _TOTAL_PAGES[file_id]) {
                showPage(++_CURRENT_PAGE[file_id], file_id);
            }
        }
        function clickPrev(file_id){
            if(_CURRENT_PAGE[file_id] != 1)
                showPage(--_CURRENT_PAGE[file_id], file_id);
        }

        // initialize and load the PDF
        async function showPDF(pdf_url, file_id) {
            if(document.querySelector("#pdf-loader-" + file_id)) {
                document.querySelector("#pdf-loader-" + file_id).style.display = 'block';
            }

            // get handle of pdf document
            try {
                _PDF_DOC[file_id] = await pdfjsLib.getDocument({ url: pdf_url });
            }
            catch(error) {
                console.log('getDocument = ', error.message);
            }

            // total pages in pdf
            _TOTAL_PAGES [file_id] = _PDF_DOC[file_id] ? _PDF_DOC[file_id].numPages: '';
            _CURRENT_PAGE[file_id] = 1;
            // Hide the pdf loader and show pdf container
            if(document.querySelector("#pdf-loader-" + file_id)) {
                document.querySelector("#pdf-loader-" + file_id).style.display = 'none';
            }
            if(document.querySelector("#pdf-contents-" + file_id)) {
                document.querySelector("#pdf-contents-" + file_id).style.display = 'block';
            }
            if(document.querySelector("#pdf-total-pages-" + file_id)) {
                document.querySelector("#pdf-total-pages-" + file_id).innerHTML = _TOTAL_PAGES[file_id];
            }

            // show the first page
            showPage(1, file_id);
        }

        // Extend jquery with flashing for elements
        $.fn.flash = function(duration, iterations) {
            duration = duration || 1000; // Default to 1 second
            iterations = iterations || 1; // Default to 1 iteration
            var iterationDuration = Math.floor(duration / iterations);

            for (var i = 0; i < iterations; i++) {
                this.fadeOut(iterationDuration).fadeIn(iterationDuration);
            }
            return this;
        }

        // load and render specific page of the PDF
        async function showPage(page_no, file_id) {
            //console.log(page_no, file_id, pdf_url);
            _PAGE_RENDERING_IN_PROGRESS[file_id] = 1;
            _CANVAS[file_id] = document.querySelector('#pdf-canvas-' + file_id);

            // disable Previous & Next buttons while page is being loaded
            document.querySelector("#pdf-next-" + file_id).disabled = true;
            document.querySelector("#pdf-prev-" + file_id).disabled = true;

            // while page is being rendered hide the canvas and show a loading message
            if(document.querySelector("#pdf-canvas-" + file_id)) {
                document.querySelector("#pdf-canvas-" + file_id).style.display = 'none';
            }
            if(document.querySelector("#page-loader-" + file_id)) {
                document.querySelector("#page-loader-" + file_id).style.display = 'block';
            }

            // update current page
            document.querySelector("#pdf-current-page-" + file_id).innerHTML = page_no;

            // get handle of page
            try {
                var page = await _PDF_DOC[file_id].getPage(page_no);
            }
            catch(error) {
                console.log('getPage - ', error.message);
            }

            // original width of the pdf page at scale 1
            var pdf_original_width = page? page.getViewport(1).width : 0;

            // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
            var scale_required = _CANVAS[file_id].width / pdf_original_width;

            // get viewport to render the page at required scale
            var viewport =  page? page.getViewport(scale_required) : 0;

            // set canvas height same as viewport height
            _CANVAS[file_id].height = viewport.height;
            //_CANVAS[file_id].width = viewport.width;

            // setting page loader height for smooth experience
            if(document.querySelector("#page-loader-" + file_id)) {
                document.querySelector("#page-loader-" + file_id).style.height = _CANVAS[file_id].height + 'px';
                document.querySelector("#page-loader-" + file_id).style.lineHeight = _CANVAS[file_id].height + 'px';

                // document.querySelector("#page-loader-" + file_id).style.width = _CANVAS[file_id].width + 'px';
                // document.querySelector("#page-loader-" + file_id).style.lineWidth = _CANVAS[file_id].width + 'px';
            }

            var render_context = {
                canvasContext: _CANVAS[file_id].getContext('2d'),
                viewport: viewport
            };

            // render the page contents in the canvas
            try {
                await page.render(render_context);
            }
            catch(error) {
                console.log('render - ', error.message);
            }

            _PAGE_RENDERING_IN_PROGRESS[file_id] = 0;

            // re-enable Previous & Next buttons
            document.querySelector("#pdf-next-" + file_id).disabled = false;
            document.querySelector("#pdf-prev-" + file_id).disabled = false;

            // show the canvas and hide the page loader
            document.querySelector("#pdf-canvas-" + file_id).style.display = 'block';
            document.querySelector("#page-loader-" + file_id).style.display = 'none';
        }

        $( document ).ready(function() {
            if(document.querySelector(".files_pdf")) {
                //console.log($(".files_pdf").length);
                $(".files_pdf").each(function (index, el){
                    el.style.display = 'none';
                    showPDF(el.value, el.lang);
                });
            }
        });

        //====================================================================================
        let  array_of_radio = new Array();
        $(".input-radio").click(
            function () {

                if (!array_of_radio.includes($(this).attr("name"))) {
                    array_of_radio.push($(this).attr("name"));
                    let name = $(this).attr("name");
                    let nav_id = name.replace("question_", "nav_");
                    //$('#' + nav_id).addClass("bg-green-200");
                    nav_id = nav_id.replace("nav_", "class_");
                    $('.' + nav_id).addClass("bg-green-200");
                }


                if ( array_of_radio.length == $(".next").attr('value')){
                    $('.submit-button').removeClass('hidden');
                    window.scrollBy({
                        top: 500,
                        behavior: 'smooth'
                    });

                    $(".submit-button").flash(7500, 10); // Flash 4 times over a period of 1 second
                }
                //console.log('array_of_radio ',  array_of_radio);
            }
        );
        $(".nav-action").click(
            function () {
                let num = $(this).attr("id");
                let num_id = num.replace("nav_", "");

                let current = $(".border-indigo-500.text-indigo-600").attr("id");
                let current_id = current.replace("nav_", "");

                current = current.replace("nav_", "class_");
                $('.'+ current).removeClass("border-indigo-500 text-indigo-600");
                $('.'+ current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 md:-mt-px hidden");

                num = num.replace("nav_", "class_");
                $('.'+ num).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 md:-mt-px hidden");
                $('.'+ num).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + num_id).removeClass('hidden');

                $("#speaker_question_" + current_id).addClass('hidden');
                $("#speaker_question_" + num_id ).removeClass('hidden');

                let name_curr = $('.' + num).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                if (current_loop_id == 1){
                    $(".prev").addClass('hidden');
                    $(".next").removeClass('hidden');
                }else if (current_loop_id == $(".next").attr('value')){
                    $(".prev").removeClass('hidden');
                    $(".next").addClass('hidden');
                } else{
                    $(".prev").removeClass('hidden');
                    $(".next").removeClass('hidden');
                }

            }
        );
        $(".prev").click(
            function () {
                let current = $(".border-indigo-500.text-indigo-600").attr("id");
                let current_id = current.replace("nav_", "");

                current = current.replace("nav_", "class_");
                $('.'+ current).removeClass("border-indigo-500 text-indigo-600");
                $('.'+ current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 md:-mt-px hidden");

                let name_curr = $('.' + current).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                let prev_loop_id = Number(current_loop_id) - 1;

                let prev_id = document.getElementsByName("nav_loop_" + prev_loop_id)[0].id
                prev_id = prev_id.replace("nav_", "");

                $('.class_' + prev_id ).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 md:-mt-px hidden");
                $('.class_' + prev_id ).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + prev_id ).removeClass('hidden');

                $("#speaker_question_" + current_id).addClass('hidden');
                $("#speaker_question_" + prev_id ).removeClass('hidden');

                name_curr = $('.class_' + prev_id).attr("name");
                prev_id = name_curr.replace("nav_loop_", "");

                if (prev_id == 1){
                    $(".prev").addClass('hidden');
                    $(".next").removeClass('hidden');
                } else{
                    $(".prev").removeClass('hidden');
                    $(".next").removeClass('hidden');
                }
            }
        );
        $(".next").click(
            function () {
                let current = $(".border-indigo-500.text-indigo-600").attr("id");
                let current_id = current.replace("nav_", "");

                current = current.replace("nav_", "class_");
                $('.' + current).removeClass("border-indigo-500 text-indigo-600");
                $('.' + current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 md:-mt-px hidden");

                let name_curr = $('.' + current).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                let next_loop_id = Number(current_loop_id) + 1

                let next_id = document.getElementsByName("nav_loop_" + next_loop_id)[0].id
                next_id = next_id.replace("nav_", "");

                $('.class_' + next_id ).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 md:-mt-px hidden");
                $('.class_' + next_id ).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + next_id ).removeClass('hidden');

                $("#speaker_question_" + current_id).addClass('hidden');
                $("#speaker_question_" + next_id ).removeClass('hidden');

                name_curr = $('.class_' + next_id).attr("name");
                next_loop_id = name_curr.replace("nav_loop_", "");

                if (next_loop_id == $(".next").attr('value')){
                    $(".prev").removeClass('hidden');
                    $(".next").addClass('hidden');
                } else{
                    $(".prev").removeClass('hidden');
                    $(".next").removeClass('hidden');
                }
            }
        );
    </script>
@endsection
