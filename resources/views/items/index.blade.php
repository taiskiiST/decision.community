@extends('layouts.app', [
    'headerName' => 'Dashboard',
])

@section('content')
    <livewire:items-list :category="$category" />
@endsection
