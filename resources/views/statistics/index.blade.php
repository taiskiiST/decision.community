@extends('layouts.app', [
    'headerName' => 'Statistics',
])

@section('styles')
    @parent

    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css">
@endsection

@section('content')
    <livewire:statistics-table />
@endsection

@section('scripts')
    @parent
    <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.8.0/dist/alpine.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/pikaday/pikaday.js"></script>
    <!-- The "defer" attribute is important to make sure Alpine waits for Livewire to load first. -->
@endsection
