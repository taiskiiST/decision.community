<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
@include('layouts._head')

<body class="antialiased">
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
            Welcome to {{ config('app.name') }}!<br>
            @auth
                <a target="_blank" href="{{ route('items.index') }}" class="underline text-center">Dashboard</a>
            @else
                Please,
                <a target="_blank" href="{{ route('login') }}" class="underline text-center">login</a>
                with you DataOnTouch credentials.
            @endauth
        </div>
    </div>
</body>
</html>
