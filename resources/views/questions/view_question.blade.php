@extends('layouts.app', [
    'headerName' => "Подробный разбор вопроса",
])
@section('styles')
    @parent

    <style>
        button {
            background-color: transparent;
            border: none;
            outline: none;
        }
        .on {
            color: #000;
        }
        .off {
            color: #ccc;
        }
        /*.star {*/
        /*    font-size: 100%;*/
        /*}*/
    </style>
@endsection

@section('content')
    <div class="bg-white shadow overflow-hidden sm:rounded-lg" id="question_{!! $question->id !!}">
        <div class="px-4 py-5 sm:px-6">
            <h1 class="text-lg leading-6 font-bold text-gray-900">
                <a href="{{route('poll.agenda',['poll'=> $poll->id])}}" class="text-indigo-600 hover:text-indigo-900">{{$poll->name}}</a>
            </h1>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                {!! $question->text !!}
            </h3>
        </div>
        <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                @foreach($question->question_files as $file)
                    <p class="pt-10">Описание: {{$file->text_for_file}}</p>
                    @if (strpos($file->path_to_file, '.pdf') === false)
                    @else
                        <object data="{{Storage::url($file->path_to_file) }}" type="application/pdf" width="100%"
                                class="lg:h-96 xl:h-96 2xl:h-96">
                            <div id="pdf-main-container-{{$file->id}}">
                                <button id="show-pdf-button-{{$file->id}}" value="{{Storage::url($file->path_to_file)}}"
                                        lang="{{$file->id}}" class="hidden files_pdf">Show PDF
                                </button>
                                <div id="pdf-loader-{{$file->id}}">Загружается...</div>
                                <div id="pdf-contents-{{$file->id}}">
                                    <div id="pdf-meta-{{$file->id}}">
                                        <div class="inline-flex flex-row w-full place-content-between">
                                            <div class="py-3">
                                                <button id="pdf-prev-{{$file->id}}" lang="{{$file->id}}"
                                                        value="{{Storage::url($file->path_to_file)}}"
                                                        onclick="clickPrev({{$file->id}})"
                                                        class="pdf-prev mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Назад
                                                </button>
                                                <button id="pdf-next-{{$file->id}}" lang="{{$file->id}}"
                                                        value="{{Storage::url($file->path_to_file)}}"
                                                        onclick="clickNext({{$file->id}})"
                                                        class="pdf-next mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                                    Вперед
                                                </button>
                                            </div>
                                            <div class="px-1 py-7 sm:px-6 flex-row-reverse ">
                                                <div id="page-count-container-{{$file->id}}" class="inline-flex">
                                                    Страница&nbsp;<div id="pdf-current-page-{{$file->id}}"></div>
                                                    /
                                                    <div id="pdf-total-pages-{{$file->id}}"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="div_canvas-{{$file->id}}"
                                         style="width:100%;height:500px;overflow-x:scroll;overflow-y:scroll;">
                                        <canvas id="pdf-canvas-{{$file->id}}" class="w-full"
                                                style="min-width:500px;"></canvas>
                                    </div>
                                    <div id="page-loader-{{$file->id}}">Загружается страница...</div>
                                </div>
                                <button id="download_file_{{$file->id}}"><a href="{{Storage::url($file->path_to_file)}}"
                                                                            target="_blank"
                                                                            class="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Открыть
                                        в отдельном окне</a></button>
                            </div>
                        </object>
                    @endif
                    @if (preg_match('/\.jpg|\.png/', $file->path_to_file) )
                        <img src={{Storage::url($file->path_to_file)}} />
                    @endif
                    @if (preg_match('/\.jpg|\.png|\.pdf/', $file->path_to_file) )
                    @else
                        <a href={{Storage::url($file->path_to_file)}} target="_blank"
                           className="bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300">Скачать</a>
                    @endif
                @endforeach
            </h3>
        </div>
    </div>

    @if (!$poll->isInformationPost())
    <div class="flex flex-col hidden lg:-mt-px xl:flex p-4">
        @if (!$poll->isReportDone())
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <p hidden>{{$maxCountAnswer = 0}}</p>
                    <table class="min-w-full divide-y divide-gray-200 border-b-2 border-gray-400 ">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                №
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            @if ($answer->countVotes($answer->id) > $maxCountAnswer)
                                <p hidden>{{$maxCountAnswer = $answer->countVotes($answer->id)}}</p>
                            @endif
                        @endforeach
                        @foreach($question->answers as $answer)
                            <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                <td class="px-6 py-4 whitespace-wrap text-left font-medium text-gray-900 @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                    {{$loop->index + 1}}
                                </td>
                                <td class="px-6 py-4 whitespace-wrap text-left font-medium text-gray-900 @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                    {{$answer->text}}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                    {{$answer->countVotes($answer->id)}}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                    {{ $poll->potential_voters_number ? round($answer->countVotes($answer->id) / $poll->potential_voters_number, 4) * 100 : 0 }}%
                                </td>
                            </tr>
                        @endforeach
                        <tr class="bg-white bg-gray-200">
                            <td class="px-6 py-4 whitespace-wrap text-left font-bold text-gray-900">
                            </td>
                            <td class="px-6 py-4 whitespace-wrap text-left font-bold text-gray-900">
                                ИТОГО
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                {{$question->countVotesByQuestion($question->id)." из ".$poll->potential_voters_number}}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                {{$question->countVotesByQuestion($question->id) && $poll->potential_voters_number ? round($question->countVotesByQuestion($question->id) / $poll->potential_voters_number, 4) * 100 : 0 }}%
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        @else
            <div class="text-center">
                <div id="id_33" class="flex flex-nowrap inline-block overflow-visible justify-center">

                    @for ($i = 1; $i <= 5; $i++)
                        <div class="w-1/9 text-7xl">
                            <button type="button" class="@if( $i <= $question->middleAnswerThatAllUsersMarkOnReport() ) on @else off @endif index_{{$i}} middelAnswerQuestion_{{$question->middleAnswerThatAllUsersMarkOnReport()}}">
                                <span class="">★</span>
                            </button>
                        </div>
                    @endfor
                </div>
                <label class="italic"> Средняя оценка работы <b>{{$question->middleAnswerThatAllUsersMarkOnReport()}}</b> @if ($question->middleAnswerThatAllUsersMarkOnReport() == 1) балл@elseif($question->middleAnswerThatAllUsersMarkOnReport() == 5) баллов@else балла@endif!</label>
                <br />
                <label class="italic"> Проголосовано <b>{{$question->countVotesByQuestion($question->id)}}</b> из <b>{{$poll->potential_voters_number}}</b></label>
            </div>
        @endif
    </div>
    @endif

    @if (!$poll->isInformationPost())
    <div class="flex flex-col xl:hidden p-4">
        @if (!$poll->isReportDone())
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div class="py-2 align-middle min-w-full sm:px-1 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table class="min-w-full divide-y divide-gray-200 ">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                №
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                Вариант ответа
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                Количество голосов
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider text-wrap">
                                В процентах
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        @foreach($question->answers as $answer)
                            <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                <td>
                                    <div class="px-1 py-4 whitespace-wrap text-sm text-gray-900 text-center @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                        {{$loop->index + 1}}
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-wrap text-sm text-gray-900 text-center @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                        {{$answer->text}}
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200 @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                        {{$answer->countVotes($answer->id)}}
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200 @if ($answer->countVotes($answer->id) == $maxCountAnswer) font-bold @endif">
                                        {{ $poll->potential_voters_number ? round($answer->countVotes($answer->id) / $poll->potential_voters_number, 4) * 100 : 0 }}%
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                        <tr class="bg-white bg-gray-100 border-b border-gray-400">
                            <td></td>
                            <td>
                                <div class="px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center">
                                    ИТОГО
                                </div>
                            </td>
                            <td>
                                <div class="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                    {{$question->countVotesByQuestion($question->id)." из ".$poll->potential_voters_number}}
                                </div>
                            </td>
                            <td>
                                <div class="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                    {{$question->countVotesByQuestion($question->id) && $poll->potential_voters_number ? round($question->countVotesByQuestion($question->id) / $poll->potential_voters_number, 4) * 100 : 0 }}%
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        @else
            <div class="text-center">
                <div id="id_33" class="flex flex-nowrap inline-block overflow-visible justify-center">

                    @for ($i = 1; $i <= 5; $i++)
                        <div class="w-1/9 text-7xl">
                            <button type="button" class="@if( $i <= $question->middleAnswerThatAllUsersMarkOnReport() ) on @else off @endif index_{{$i}} middelAnswerQuestion_{{$question->middleAnswerThatAllUsersMarkOnReport()}}">
                                <span class="">★</span>
                            </button>
                        </div>
                    @endfor
                </div>
                <label class="italic"> Средняя оценка работы <b>{{$question->middleAnswerThatAllUsersMarkOnReport()}}</b> @if ($question->middleAnswerThatAllUsersMarkOnReport() == 1) балл@elseif($question->middleAnswerThatAllUsersMarkOnReport() == 5) баллов@else балла@endif!</label>
                <br />
                <label class="italic"> Проголосовано <b>{{$question->countVotesByQuestion($question->id)}}</b> из <b>{{$poll->potential_voters_number}}</b></label>
            </div>
        @endif
    </div>
    @endif

    <div class="inline-flex flex-row w-full place-content-between">
        <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
            @if ($search)
                @if ($search == 'form_public_page')
                    @if($poll->isSuggestedQuestion())
                        <a href="{{route('poll.questions.view_suggested_questions')}}"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                                Назад
                            </button></a>
                    @else
                        <a href="/polls/view/public/questions/"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                            Назад
                        </button></a>
                    @endif
                @else
                <a href="{{route('poll.questions.search_question',['search'=>$search])}}"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                        Назад
                    </button></a>
                @endif
            @else
                <a href="{{route('poll.agenda',['poll'=>$poll->id])}}"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                        Назад
                    </button></a>
            @endif
        </div>
    </div>
@endsection

@section('scripts')
    @parent()
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
                return confirm('Вы уверены? Ответы нельзя будет изменить впоследствии.')
            }
        );

        function clickNext(file_id) {
            if (_CURRENT_PAGE[file_id] != _TOTAL_PAGES[file_id]) {
                showPage(++_CURRENT_PAGE[file_id], file_id);
            }
        }

        function clickPrev(file_id) {
            if (_CURRENT_PAGE[file_id] != 1)
                showPage(--_CURRENT_PAGE[file_id], file_id);
        }

        // initialize and load the PDF
        async function showPDF(pdf_url, file_id) {
            if (document.querySelector("#pdf-loader-" + file_id)) {
                document.querySelector("#pdf-loader-" + file_id).style.display = 'block';
            }

            // get handle of pdf document
            try {
                _PDF_DOC[file_id] = await pdfjsLib.getDocument({url: pdf_url});
            } catch (error) {
                console.log('getDocument = ', error.message);
            }

            // total pages in pdf
            _TOTAL_PAGES [file_id] = _PDF_DOC[file_id].numPages;
            _CURRENT_PAGE[file_id] = 1;
            // Hide the pdf loader and show pdf container
            if (document.querySelector("#pdf-loader-" + file_id)) {
                document.querySelector("#pdf-loader-" + file_id).style.display = 'none';
            }
            if (document.querySelector("#pdf-contents-" + file_id)) {
                document.querySelector("#pdf-contents-" + file_id).style.display = 'block';
            }
            if (document.querySelector("#pdf-total-pages-" + file_id)) {
                document.querySelector("#pdf-total-pages-" + file_id).innerHTML = _TOTAL_PAGES[file_id];
            }

            // show the first page
            showPage(1, file_id);
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
            if (document.querySelector("#pdf-canvas-" + file_id)) {
                document.querySelector("#pdf-canvas-" + file_id).style.display = 'none';
            }
            if (document.querySelector("#page-loader-" + file_id)) {
                document.querySelector("#page-loader-" + file_id).style.display = 'block';
            }

            // update current page
            document.querySelector("#pdf-current-page-" + file_id).innerHTML = page_no;

            // get handle of page
            try {
                var page = await _PDF_DOC[file_id].getPage(page_no);
            } catch (error) {
                console.log('getPage - ', error.message);
            }

            // original width of the pdf page at scale 1
            var pdf_original_width = page.getViewport(1).width;

            // as the canvas is of a fixed width we need to adjust the scale of the viewport where page is rendered
            var scale_required = _CANVAS[file_id].width / pdf_original_width;

            // get viewport to render the page at required scale
            var viewport = page.getViewport(scale_required);

            // set canvas height same as viewport height
            _CANVAS[file_id].height = viewport.height;
            //_CANVAS[file_id].width = viewport.width;

            // setting page loader height for smooth experience
            if (document.querySelector("#page-loader-" + file_id)) {
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
            } catch (error) {
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

        $(document).ready(function () {
            if (document.querySelector(".files_pdf")) {
                //console.log($(".files_pdf").length);
                $(".files_pdf").each(function (index, el) {
                    el.style.display = 'none';
                    showPDF(el.value, el.lang);
                });
            }
        });

        //====================================================================================
        let array_of_radio = new Array();
        $(".input-radio").click(
            function () {

                if (!array_of_radio.includes($(this).attr("name"))) {
                    array_of_radio.push($(this).attr("name"));
                    let name = $(this).attr("name");
                    let nav_id = name.replace("question_", "nav_");
                    $('#' + nav_id).addClass("bg-green-200");
                }


                if (array_of_radio.length == $(".next").attr('value')) {
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
                $('#' + current).removeClass("border-indigo-500 text-indigo-600");
                $('#' + current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");

                $('#' + num).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");
                $('#' + num).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + num_id).removeClass('hidden');

                $("#speaker_question_" + current_id).addClass('hidden');
                $("#speaker_question_" + num_id).removeClass('hidden');

                let name_curr = $('#' + num).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                if (current_loop_id == 1) {
                    $(".prev").addClass('hidden');
                    $(".next").removeClass('hidden');
                } else if (current_loop_id == $(".next").attr('value')) {
                    $(".prev").removeClass('hidden');
                    $(".next").addClass('hidden');
                } else {
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

                $('#' + current).removeClass("border-indigo-500 text-indigo-600");
                $('#' + current).addClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");

                let name_curr = $('#' + current).attr("name");
                let current_loop_id = name_curr.replace("nav_loop_", "");

                let prev_loop_id = Number(current_loop_id) - 1;

                let prev_id = document.getElementsByName("nav_loop_" + prev_loop_id)[0].id
                prev_id = prev_id.replace("nav_", "");

                $('#nav_' + prev_id).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");
                $('#nav_' + prev_id).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + prev_id).removeClass('hidden');

                $("#speaker_question_" + current_id).addClass('hidden');
                $("#speaker_question_" + prev_id).removeClass('hidden');

                name_curr = $('#nav_' + prev_id).attr("name");
                prev_id = name_curr.replace("nav_loop_", "");

                if (prev_id == 1) {
                    $(".prev").addClass('hidden');
                    $(".next").removeClass('hidden');
                } else {
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

                $('#nav_' + next_id).removeClass("border-transparent text-gray-500.hover:text-gray-700 hover:border-gray-300 hidden md:-mt-px md:flex");
                $('#nav_' + next_id).addClass("border-indigo-500 text-indigo-600");

                $("#question_" + current_id).addClass('hidden');
                $("#question_" + next_id).removeClass('hidden');

                $("#speaker_question_" + current_id).addClass('hidden');
                $("#speaker_question_" + next_id).removeClass('hidden');

                name_curr = $('#nav_' + next_id).attr("name");
                next_loop_id = name_curr.replace("nav_loop_", "");

                if (next_loop_id == $(".next").attr('value')) {
                    $(".prev").removeClass('hidden');
                    $(".next").addClass('hidden');
                } else {
                    $(".prev").removeClass('hidden');
                    $(".next").removeClass('hidden');
                }
            }
        );
    </script>
@endsection
