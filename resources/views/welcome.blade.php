<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
@include('layouts._head')

<body class="antialiased">
    <div class="flex items-center justify-center h-screen">
        <div class="text-center">
            Добро пожаловать!<br>
            @auth
                <a target="_blank" href="{{ route('items.index') }}" class="underline text-center">Структура</a>
            @else
                Если вы Администратор, пожалуйста
                <a target="_blank" href="{{ route('login') }}" class="underline text-center">пройдите</a>
                аутентификацию или
                <a target="_blank" href="{{ route('register') }}" class="underline text-center">зарегистрируйтесь</a>
            @endauth
        </div>
    </div>
</body>
</html>
