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

    @guest
      @yield('guest-nav')
    @endguest

    <header class="z-0 shadow">
        <div class="relative overflow-hidden bg-indigo-800 h-128">
            <img class="absolute top-0 left-0 object-cover w-full h-auto h-full opacity-50" src="/images/header.jpg" alt="Header Image" />
        </div>
    </header>

    <main class="flex-1">
        <div class="px-2 py-6 mx-auto max-w-9xl sm:px-6 lg:px-8">
            <div class="relative h-auto px-0 bg-white shadow-xl -mt-118">
                <div id="AppendSectionDiv"><table id="AppendSectionTable"></table></div>
                @yield('content')

                @isInertiaRoute
                    @inertia
                @endisInertiaRoute
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
@isInertiaRoute
  <script src="{{ mix('js/bootstrap-inertia.js') }}"></script>
@endisInertiaRoute
@yield('scripts')
</body>
</html>
