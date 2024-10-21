@extends('layouts.app', [
    'headerName' => "Опрос {$poll->name}",
])

@section('content')




@foreach($arr_strings as $str)
    {!! $str  !!}
    <br />
@endforeach
@endsection
