<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@if (session('current_company')) {{session('current_company')->title}} @else {{ config('app.name') }} @endif </title>

    <!-- Scripts -->
    <script src="{{ mix('js/app.js') }}"></script>

    <style>
        body {
            font-family: 'Nunito' !important;
        }
        .Highlight{
            background-color: rgb(129 140 248);
        }
    </style>

    <link href="{{ mix('css/tailwind.css') }}" rel="stylesheet">
    <link href="{{ mix('css/antd.css') }}" rel="stylesheet">
    <link href="{{ mix('css/app.css') }}" rel="stylesheet">

    @yield('styles')

    @livewireStyles
</head>
