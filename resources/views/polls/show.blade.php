@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    @foreach($poll->questions as $question)
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {{ $question->text }}
                </h3>
            </div>

            <div>
                <fieldset>
                    <div class="bg-white rounded-md -space-y-px">
                    @foreach($question->answers as $answer)
                        <!-- Checked: "bg-indigo-50 border-indigo-200 z-10", Not Checked: "border-gray-200" -->
                        <label class="border-gray-200 rounded-tl-md rounded-tr-md relative border p-4 flex cursor-pointer">
                            <input type="radio" name="question_{{ $question->id }}" class="h-4 w-4 mt-0.5 cursor-pointer text-indigo-600 border-gray-300 focus:ring-indigo-500" aria-labelledby="privacy-setting-0-label" aria-describedby="privacy-setting-0-description">

                            <div class="ml-3 flex flex-col">
                                <!-- Checked: "text-indigo-900", Not Checked: "text-gray-900" -->
                                <span id="privacy-setting-0-label" class="text-gray-900 block text-sm font-medium">
                                  {{ $answer->text }}
                                </span>
                            </div>
                        </label>
                        @endforeach
                    </div>
                </fieldset>
            </div>
        </div>
    @endforeach
@endsection
