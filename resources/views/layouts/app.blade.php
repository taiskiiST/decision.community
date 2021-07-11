<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
@include('layouts._head')

<body class="antialiased">
<!--
  Tailwind UI components require Tailwind CSS v1.8 and the @tailwindcss/ui plugin.
  Read the documentation to get started: https://tailwindui.com/documentation
-->
<div class="flex flex-col min-h-screen bg-gray-100">
    @auth
        <livewire:nav-component />
    @endauth

    <header class="z-0 shadow">
        <div class="relative overflow-hidden h-128 bg-indigo-800">
            <img class="absolute left-0 top-0 w-full h-full object-cover h-auto opacity-50" src="/images/header.jpg" alt="Header Image" />
        </div>
    </header>

    <main class="flex-1">
        <div class="max-w-7xl mx-auto py-6 px-2 sm:px-6 lg:px-8">
            <div class="relative -mt-118 h-auto bg-white px-0 shadow-xl">
                @yield('content')
            </div>
        </div>
    </main>

    @include('layouts.footer')
</div>

<script type="application/javascript">
    window.GATE_URL = '{!! config('services.gate.url') !!}';
</script>

@livewireScripts
<script src="{{ mix('js/manifest.js') }} "></script>
<script src="{{ mix('js/vendor.js') }}"></script>
<script src="{{ mix('js/app.js') }}"></script>
@yield('scripts')
</body>
</html>
