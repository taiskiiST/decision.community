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

    @if (auth()->user() ? auth() && auth()->user()->canVote() : $poll->isPublicVote())
        @if ($poll->isPublicVote() || (!$poll->finished && !$poll->authUserVote() && !$poll->isGovernanceMeetingTSN() || $displayMode) || $poll->isGovernanceMeetingTSN() && auth()->user()->isGovernance() )
            @if (!$poll->isPublicVote())
                {!! Form::open(['route' => ['poll.submit', ['poll' => $poll] ], 'method' => 'POST']) !!}
            @else
                {!! Form::open(['route' => ['poll.submit.public', ['poll' => $poll] ], 'method' => 'POST']) !!}
            @endif
            <!-- This example requires Tailwind CSS v2.0+ -->
            <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div class="text-center"><span style="font-size: x-large;"><b>{{$poll->name}}</b></span></div>
                @if ($poll->isPublicVote())
                    <input name="private_poll" value="true" hidden/>
                @endif
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
                            <button id="nav_{!! $question->id !!}" class="{!! $loop->first ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex' !!} border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium nav-action outline-none focus:outline-none" type="button" name="nav_loop_{!! $loop->index + 1 !!}">
                                {!! $loop->index + 1 !!} <span class='max-mobile md:hidden'> / {!! $loop->count !!} </span>
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
                                            <div id="pdf-main-container" class="">
                                                <button id="show-pdf-button" value="{{Storage::url($file->path_to_file)}}" class="hidden">Show PDF</button>
                                                <div id="pdf-loader">Загружается...</div>
                                                <div id="pdf-contents">
                                                    <div id="pdf-meta">
                                                        <div class="inline-flex flex-row w-full place-content-between">
                                                            <div class="py-3">
                                                                <button id="pdf-prev" class="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Назад</button>
                                                                <button id="pdf-next" class="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Вперед</button>
                                                            </div>
                                                            <div class="px-1 py-7 sm:px-6 flex-row-reverse ">
                                                                <div id="page-count-container" class="inline-flex">Страница&nbsp;<div id="pdf-current-page"></div>/<div id="pdf-total-pages"></div></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <canvas id="pdf-canvas" class="w-full"></canvas>
                                                    <div id="page-loader">Загружается страница...</div>
                                                </div>
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
                        @if (!$displayMode)
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

                <div class="inline-flex flex-row w-full place-content-between">
                    <div class="px-4 py-3 sm:px-6">
                        <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hidden submit-button"
                       id="button_submit">
                            Отправить
                        </button>
                    </div>
                    <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                        <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                               @if ($displayMode) Назад @else Отмена @endif
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
        var _PDF_DOC,
            _CURRENT_PAGE,
            _TOTAL_PAGES,
            _PAGE_RENDERING_IN_PROGRESS = 0,
            _CANVAS = document.querySelector('#pdf-canvas');

        $("#button_submit").click(
            function () {
                return confirm('Вы уверены? Ответы нельзя будет изменить впоследствии.')
            }
        );

        // initialize and load the PDF
        async function showPDF(pdf_url) {
            if(document.querySelector("#pdf-loader")) {
                document.querySelector("#pdf-loader").style.display = 'block';
            }

            // get handle of pdf document
            try {
                _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url });
            }
            catch(error) {
                alert(error.message);
            }

            // total pages in pdf
            _TOTAL_PAGES = _PDF_DOC.numPages;

            // Hide the pdf loader and show pdf container
            if(document.querySelector("#pdf-loader")) {
                document.querySelector("#pdf-loader").style.display = 'none';
            }
            if(document.querySelector("#pdf-contents")) {
                document.querySelector("#pdf-contents").style.display = 'block';
            }
            if(document.querySelector("#pdf-total-pages")) {
                document.querySelector("#pdf-total-pages").innerHTML = _TOTAL_PAGES;
            }

            // show the first page
            showPage(1);
        }

        // load and render specific page of the PDF
        async function showPage(page_no) {
            _PAGE_RENDERING_IN_PROGRESS = 1;
            _CURRENT_PAGE = page_no;

            // disable Previous & Next buttons while page is being loaded
            document.querySelector("#pdf-next").disabled = true;
            document.querySelector("#pdf-prev").disabled = true;

            // while page is being rendered hide the canvas and show a loading message
            if(document.querySelector("#pdf-canvas")) {
                document.querySelector("#pdf-canvas").style.display = 'none';
            }
            if(document.querySelector("#page-loader")) {
                document.querySelector("#page-loader").style.display = 'block';
            }

            // update current page
            document.querySelector("#pdf-current-page").innerHTML = page_no;

            // get handle of page
            try {
                var page = await _PDF_DOC.getPage(page_no);
            }
            catch(error) {
                alert(error.message);
            }

            // original width of the pdf page at scale 1
            var pdf_original_width = page.getViewport(0.9).width;

            // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
            var scale_required = _CANVAS.width / pdf_original_width;

            // get viewport to render the page at required scale
            var viewport = page.getViewport(scale_required);

            // set canvas height same as viewport height
            _CANVAS.height = viewport.height;

            // setting page loader height for smooth experience
            if(document.querySelector("#page-loader")) {
                document.querySelector("#page-loader").style.height = _CANVAS.height + 'px';
                document.querySelector("#page-loader").style.lineHeight = _CANVAS.height + 'px';
            }

            var render_context = {
                canvasContext: _CANVAS.getContext('2d'),
                viewport: viewport
            };

            // render the page contents in the canvas
            try {
                await page.render(render_context);
            }
            catch(error) {
                alert(error.message);
            }

            _PAGE_RENDERING_IN_PROGRESS = 0;

            // re-enable Previous & Next buttons
            document.querySelector("#pdf-next").disabled = false;
            document.querySelector("#pdf-prev").disabled = false;

            // show the canvas and hide the page loader
            document.querySelector("#pdf-canvas").style.display = 'block';
            document.querySelector("#page-loader").style.display = 'none';
        }

        // click on the "Previous" page button
        if(document.querySelector("#pdf-prev")) {
            document.querySelector("#pdf-prev").addEventListener('click', function () {
                if (_CURRENT_PAGE != 1)
                    showPage(--_CURRENT_PAGE);
            });
        }

        // click on the "Next" page button
        if(document.querySelector("#pdf-next")) {
            document.querySelector("#pdf-next").addEventListener('click', function () {
                if (_CURRENT_PAGE != _TOTAL_PAGES)
                    showPage(++_CURRENT_PAGE);
            });
        }

        $( document ).ready(function() {
            if(document.querySelector("#show-pdf-button")) {
                document.querySelector("#show-pdf-button").style.display = 'none';
                value = document.querySelector("#show-pdf-button").value;
                showPDF(value);
            }
            //showPDF('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf');
        });

        //====================================================================================
        let  array_of_radio = new Array();
        $(".input-radio").click(
            function () {

                if (!array_of_radio.includes($(this).attr("name"))) {
                    array_of_radio.push($(this).attr("name"));
                    let name = $(this).attr("name");
                    let nav_id = name.replace("question_", "nav_");
                    $('#' + nav_id).addClass("bg-green-200");
                }


                if ( array_of_radio.length == $(".next").attr('value')){
                    $('.submit-button').removeClass('hidden');
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
                $('#'+ current).removeClass("border-indigo-500 text-indigo-600");
                $('#'+ current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");

                $('#'+ num).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");
                $('#'+ num).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + num_id).removeClass('hidden');

                let name_curr = $('#' + num).attr("name");
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
                //console.log('next value ',  );
            }
        );
        $(".prev").click(
            function () {
                let current = $(".border-indigo-500.text-indigo-600").attr("id");
                let current_id = current.replace("nav_", "");

                $('#'+ current).removeClass("border-indigo-500 text-indigo-600");
                $('#'+ current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");

                let name_curr = $('#' + current).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                let prev_loop_id = Number(current_loop_id) - 1;

                let prev_id = document.getElementsByName("nav_loop_" + prev_loop_id)[0].id
                prev_id = prev_id.replace("nav_", "");

                $('#nav_' + prev_id ).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");
                $('#nav_' + prev_id ).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + prev_id ).removeClass('hidden');

                name_curr = $('#nav_' + prev_id).attr("name");
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

                $('#' + current).removeClass("border-indigo-500 text-indigo-600");
                $('#' + current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");

                let name_curr = $('#' + current).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                let next_loop_id = Number(current_loop_id) + 1

                let next_id = document.getElementsByName("nav_loop_" + next_loop_id)[0].id
                next_id = next_id.replace("nav_", "");

                $('#nav_' + next_id ).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");
                $('#nav_' + next_id ).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + next_id ).removeClass('hidden');

                name_curr = $('#nav_' + next_id).attr("name");
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
