@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')
    @foreach($poll->questions as $question)
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {!!  $question->text !!}
                </h3>
            </div>


        </div>
    @endforeach
@endsection
