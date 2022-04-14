@extends('layouts.app', [
    'headerName' => "Результаты голосования по: {$poll->name}",
])

@section('content')
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

<div class="p-2">
    <!-- This example requires Tailwind CSS v2.0+ -->
    <label class="block text-lg text-black font-bold whitespace-wrap">Результаты по {{$poll->name}}</label>
    <div class="flex flex-col hidden lg:-mt-px xl:flex">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    @foreach($poll->questions as $question)
                    <label class="block text-lg text-black font-semibold mt-10 whitespace-wrap">{{$loop->index + 1}}. {!!$question->text!!}</label>
                    <table class="min-w-full divide-y divide-gray-200 border-b-2 border-gray-400 ">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            <tr class="bg-white @if ($loop->odd) bg-gray-200 @endif">
                                <td class="px-6 py-4 whitespace-wrap text-left font-medium text-gray-900">
                                    {{$answer->text}}
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    @if(!$poll->isPublicVote())
                                        {{$answer->countVotes($answer->id)}}
                                    @else
                                        {{$answer->countVotesAnonymous($answer->id)}}
                                    @endif
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    @if(!$poll->isPublicVote())
                                        {{$answer->percentOfQuestions($question->id, $answer->id) }}
                                    @else
                                        {{$answer->percentOfQuestionsAnonymous($question->id, $answer->id) }}
                                    @endif%
                                </td>
                            </tr>
                        @endforeach
                        <tr class="bg-white @if (!$loop->odd) bg-gray-200 @endif">
                            <td class="px-6 py-4 whitespace-wrap text-left font-bold text-gray-900">
                                ИТОГО
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                @if(!$poll->isPublicVote())
                                    {{$question->countVotesByQuestion($question->id)}}
                                @else
                                    {{$question->countVotesByQuestionAnonymous($question->id)}}
                                @endif
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                                @if(!$poll->isPublicVote())
                                    {{$question->countVotesByQuestion($question->id)? 100 : 0 }}%
                                @else
                                    {{$question->countVotesByQuestionAnonymous($question->id)? 100 : 0 }}%
                                @endif
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    @endforeach
                </div>
            </div>
        </div>
    </div>

    <div class="flex flex-col xl:hidden ">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8 ">
            <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    @foreach($poll->questions as $question)
                    <label class="block text-lg text-black font-semibold mt-6 whitespace-wrap">{{$loop->index + 1}}. {!!$question->text!!}</label>
                    <table class="min-w-full divide-y divide-gray-200 ">
                        <thead class="bg-gray-50">
                        <tr>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider">
                                Вариант ответа
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider">
                                Количество голосов
                            </th>
                            <th scope="col" class="px-1 py-3 text-left text-xs font-medium text-gray-500 whitespace-wrap tracking-wider">
                                В процентах
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        @foreach($question->answers as $answer)
                            <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                <td>
                                    <div class="px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center">
                                        {{$answer->text}}
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$answer->countVotes($answer->id)}}
                                        @else
                                            {{$answer->countVotesAnonymous($answer->id)}}
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$answer->percentOfQuestions($question->id, $answer->id) }}
                                        @else
                                            {{$answer->percentOfQuestionsAnonymous($question->id, $answer->id) }}
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                            <tr class="bg-white bg-gray-100 border-b border-gray-400">
                                <td>
                                    <div class="px-1 py-4 whitespace-wrap text-sm font-bold text-gray-900 text-center">
                                        ИТОГО
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$question->countVotesByQuestion($question->id)}}
                                        @else
                                            {{$question->countVotesByQuestionAnonymous($question->id)}}
                                        @endif
                                    </div>
                                </td>
                                <td>
                                    <div class="px-1 py-4 whitespace-nowrap font-bold text-center text-sm font-medium bg-gray-200">
                                        @if(!$poll->isPublicVote())
                                            {{$question->countVotesByQuestion($question->id)? 100 : 0 }}%
                                        @else
                                            {{$question->countVotesByQuestionAnonymous($question->id)? 100 : 0 }}%
                                        @endif
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
    @if ($poll->finished)
        @if (!$poll->protocol_doc)
            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <form method="POST" action="{{route('poll.generateProtocol',['poll'=>$poll])}}">
                    @csrf
                    <input name="del_poll" value="{{$poll->id}}" type="hidden"/>
                    <a href="{{route('poll.generateProtocol',['poll'=>$poll])}}"
                       onclick="event.preventDefault();
                                                        this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                        <button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                            {{ __('Сгенерировать протокол') }}
                        </button>
                    </a>
                </form>
            </div>
        @else
            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <a href="{{$poll->protocol_doc}}" target="_blank">
                    <button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                        {{ __('Скачать протокол в Ворде') }}
                    </button>
                </a>
            </div>
            <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
                <form method="POST" action="{{route('poll.generateProtocol',['poll'=>$poll])}}">
                    @csrf
                    <input name="del_poll" value="{{$poll->id}}" type="hidden"/>
                    <a href="{{route('poll.generateProtocol',['poll'=>$poll])}}"
                       onclick="event.preventDefault();
                                                        this.closest('form').submit();" class="text-indigo-600 hover:text-indigo-900">
                        <button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500" >
                            {{ __('Обновить протокол') }}
                        </button>
                    </a>
                </form>
            </div>
        @endif
    @endif
    @if ($poll->protocol)
    <label class="block text-lg py-8 text-black font-bold whitespace-wrap">Итоговый протокол:</label>
    <div class="lg:h-96 xl:h-96 2xl:h-96 md:h-96">
        <object data={{Storage::url($poll->protocol) }} type="application/pdf" width="100%" class="h-full">
            <div id="pdf-main-container" class="">
                <button id="show-pdf-button" value="{{Storage::url($poll->protocol)}}" class="hidden">Show PDF</button>
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
                    <div id="div_canvas" style="width:100%;height:500px;overflow-x:scroll;overflow-y:scroll;">
                        <canvas id="pdf-canvas" class="w-full" style="min-width:500px;"></canvas>
                    </div>
                    <div id="page-loader">Загружается страница...</div>
                </div>
                <button id="download" ><a href="{{Storage::url($poll->protocol)}}" target="_blank" class="mt-4 inline-flex items-center px-2 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Открыть в отдельном окне</a></button>
            </div>
        </object>
    </div>
    @endif
    <div class="inline-flex flex-row w-full place-content-between">

        <div class="px-4 py-7 sm:px-6 flex-row-reverse ">
            <a href="/polls"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                    Назад
                </button></a>
        </div>
    </div>
</div>




<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.228/pdf.min.js"></script>
<script>
    var _PDF_DOC,
        _CURRENT_PAGE,
        _TOTAL_PAGES,
        _PAGE_RENDERING_IN_PROGRESS = 0,
        _CANVAS = document.querySelector('#pdf-canvas');

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
    });

</script>

@endsection
