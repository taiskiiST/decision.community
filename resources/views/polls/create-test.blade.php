@extends('layouts.app', [
    'headerName' => "Создание нового опраса",
])

@section('content')

    <div class="mt-10 sm:mt-0">
        <div class="grid">
            <div class="mt-5 md:mt-0 md:col-span-2">
                <form action="#" method="POST">
                    <div class="col-span-1">
                        <div class="px-4 sm:px-0">
                            <h3 class="text-lg font-medium leading-6 text-gray-900 mt-6 ml-6">Создание нового опроса</h3>
                        </div>
                    </div>
                    <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                            <div class="grid grid-cols-6 gap-6">
                                <div class="col-span-6 sm:col-span-3">
                                    <label for="first-name" class="block text-sm font-medium text-gray-700">Введите название опроса</label>
                                    <input type="text" name="first-name" id="first-name" autocomplete="given-name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
                                </div>
                            </div>
                            <div id="question0" class="">
                            </div>
                        </div>
                        <div class="inline-flex flex-row w-full place-content-between">
                            <div class="px-4 py-3 bg-gray-50  sm:px-6">
                                <button type="button" class="justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onclick="addQuestion()">
                                        Добавить вопрос
                                </button>
                            </div>
                            <div class="px-4 py-3 bg-gray-50 sm:px-6 flex-row-reverse ">
                                <a href="{{route('polls.index')}}"><button type="button" class="justify-end py-2 px-4 border border-transparent text-sm font-medium text-white shadow-sm rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" >
                                    Отмена
                                </button></a>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script>
        var counterQuestions = 1;
        var counterData = 1;
        function question(cnt) {
            return  "<div id=\"question" + cnt + "\" class=\"col-span-3 sm:col-span-3 mt-6 pt-6 border-t border-gray-400 \">\n" +
                    "   <div class=\"inline-flex flex-row w-full\">" +
                    "       <label for=\"first-name\" class=\"block text-sm font-medium text-gray-700\">Введите текст вопроса №" + cnt +"</label>" +
                    "       <div class=\"flex-row-reverse contents\" >" +
                    "           <button id=\"btn-del-question-" + cnt + "\" class=\"ml-auto text-red-800\" type=\"button\">\n" +
                    "               <svg class=\"h-8 w-8\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" aria-hidden=\"true\">\n" +
                    "                   <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\" />\n" +
                    "               </svg>" +
                    "           </button>" +
                    "       </div>" +
                    "   </div>" +
                    "   <textarea type=\"text\" name=\"first-name\" id=\"first-name\" autocomplete=\"given-name\" class=\"mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md\"><\/textarea>\n" +
                    "</div>" +
                    "<button type=\"button\" class=\"inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2\" onclick=\"addData(" + cnt + ")\">\n" +
                    "   Добавить файл к вопросу\n" +
                    "</button>";
        }
        function data(cntQuestion, cntData) {
            return "<div id=\"data" + cntData + "\" class=\"col-span-6 sm:col-span-3 mt-3\">\n" +
                "   <div class=\"inline-flex flex-row w-full\">" +
                "       <label for=\"first-name\" class=\"block text-sm font-medium text-gray-700\">Введите описание файла к вопросу №" + cntQuestion + ", файлу № "+ cntData +" </label>\n" +
                "       <div class=\"flex-row-reverse contents\" >" +
                "           <button id=\"btn-del-data-" + cntData + "\" class=\"ml-auto text-red-800\" type=\"button\">\n" +
                "               <svg class=\"h-8 w-8\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke=\"currentColor\" aria-hidden=\"true\">\n" +
                "                   <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M6 18L18 6M6 6l12 12\" />\n" +
                "               </svg>" +
                "           </button>" +
                "       </div>" +
                "       </div>" +
                "       <textarea type=\"text\" name=\"first-name\" id=\"first-name\" autocomplete=\"given-name\" class=\"mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md\"><\/textarea>\n" +
                "   </div>" +
                " <div>\n" +
                "              <div class=\"mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md\">\n" +
                "                <div class=\"space-y-1 text-center\">\n" +
                "                  <svg class=\"mx-auto h-12 w-12 text-gray-400\" stroke=\"currentColor\" fill=\"none\" viewBox=\"0 0 48 48\" aria-hidden=\"true\">\n" +
                "                    <path d=\"M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />\n" +
                "                  </svg>\n" +
                "                  <div class=\"flex text-sm text-gray-600\">\n" +
                "                    <label for=\"file-upload\" class=\"relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500\">\n" +
                "                      <span>Загрузите файл</span>\n" +
                "                      <input id=\"file-upload\" name=\"files[]\" type=\"file\" multiple=\"multiple\" class=\"sr-only\">\n" +
                "                    </label>\n" +
                "                  </div>\n" +
                "                  <p class=\"text-xs text-gray-500\">\n" +
                "                    PDF, PNG, JPG, GIF не более 10MB\n" +
                "                  </p>\n" +
                "                </div>\n" +
                "              </div>\n" +
                "            </div>"
        }
        //$("#tab_1_2").remove();
        //$("#tabs_1_2").append(html_text);
        function addQuestion() {
            $("#question0").append(question(counterQuestions))
            ++counterQuestions
            //counterData=1
        }
        function addData(cnt_question) {
            $("#question"+cnt_question).append(data(cnt_question, counterData))
            ++counterData
        }
    </script>


@endsection
