<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Застройщик ИП Тягун В.П.</title>

    <link href="{{ mix('css/tailwind.css') }}" rel="stylesheet">
</head>
<body>
    <div id="landingMainPage">
    </div>
    <script src="{{ mix('js/manifest.js') }} "></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
    <script src="{!! mix('/js/LandingMainPage.js') !!}"></script>
</body>
</html>