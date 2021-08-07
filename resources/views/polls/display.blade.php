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


    {!! Form::open(['route' => ['poll.submit', $poll], 'method' => 'POST', 'onsubmit' => "return confirm('Вы уверены? Ответы нельзя будет изменить впоследствии.');"]) !!}
    <!-- This example requires Tailwind CSS v2.0+ -->
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
        <div class="text-center"><span style="font-size: x-large;"><b>{{$poll->name}}</b></span></div>
        <div class="flex justify-between items-center flex-flow" style="flex-flow: row wrap;">

            <div>
                <label for="phone" class="block text-sm font-medium text-gray-700">Телефон</label>

                <div class="mt-1 relative rounded-md shadow-sm -ml-3">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span class="text-gray-500 sm:text-sm ml-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </span>
                        <span>+7</span>
                    </div>

                    <input min="0" step="1" type="number" name="phone" pattern1="^\d\d\d\d\d\d\d\d\d\d$" id="phone" class="ml-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="9007775511" style="padding-left:20%">
                </div>
            </div>

            <div class="flex justify-between items-center">
                <div>
                    <label for="pin" class="block text-sm font-medium text-gray-700">ПИН</label>

                    <div class="mt-1 relative rounded-md shadow-sm -ml-3">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span class="text-gray-500 sm:text-sm ml-1">
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                      </svg>
                                  </span>
                        </div>

                        <input type="number" name="pin" id="pin" pattern1="^\d\d\d\d$" class="ml-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="XXXX">
                    </div>
                </div>
            </div>
        </div>

        <br/>
        <div style="display: none">{{$cnt = 1}}</div>
        @foreach($poll->questions as $question)
            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        {{$cnt++}}) {!! $question->text !!}
                    </h3>
                </div>

                <div>
                    <fieldset>
                        <div class="bg-white rounded-md -space-y-px">
                        @foreach($question->answers as $answer)
                            <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
                                <label class="border-gray-200 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer">
                                    <input type="radio" name="question_{{ $question->id }}" value="{{ $answer->id }}" class="h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500" aria-labelledby="privacy-setting-0-label" aria-describedby="privacy-setting-0-description">

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
            </div>
            <br />
        @endforeach

        <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Отправить
        </button>
    </div>
    {!! Form::close() !!}

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script>
        $(document).on('keydown', 'input[pattern1]', function(e){
            var input = $(this);
            var oldVal = input.val();

            if ( (oldVal.length == 10) && ($(this).attr('name') == 'phone') ) {
                var regex = new RegExp(input.attr('pattern1'), 'g');
                setTimeout(function () {
                    var newVal = input.val();
                    if(newVal.length >= oldVal.length) {
                        if (!regex.test(newVal)) {
                            input.val(oldVal);
                        }
                    }
                }, 1);

            }
            if ( (oldVal.length == 4) && ($(this).attr('name') == 'pin') ) {
                var regex = new RegExp(input.attr('pattern1'), 'g');
                setTimeout(function () {
                    var newVal = input.val();
                    if(newVal.length >= oldVal.length) {
                        if (!regex.test(newVal)) {
                            input.val(oldVal);
                        }
                    }
                }, 1);

            }
        });
    </script>
@endsection
