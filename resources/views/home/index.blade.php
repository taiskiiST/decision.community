<!DOCTYPE html>
<html class="h-full" lang="{{ str_replace('_', '-', app()->getLocale()) }}">
@include('layouts._head')

<body class="antialiased h-full">
<div class="bg-brand-green">
    <!-- Header -->
    <header class="absolute inset-x-0 top-0 z-50">
        <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div class="flex lg:flex-1">
                <a href="#" class="-m-1.5 p-1.5">
                    <span class="sr-only">Your Company</span>
                    <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="">
                </a>
            </div>
            <div class="flex lg:hidden">
                <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                    <span class="sr-only">Open main menu</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            <div class="hidden lg:flex lg:gap-x-12">
                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Product</a>
                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Features</a>
                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Resources</a>
                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Company</a>
            </div>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Log in <span aria-hidden="true">&rarr;</span></a>
            </div>
        </nav>
        <!-- Mobile menu, show/hide based on menu open state. -->
        <div class="lg:hidden" role="dialog" aria-modal="true">
            <!-- Background backdrop, show/hide based on slide-over state. -->
            <div class="fixed inset-0 z-50"></div>
            <div class="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div class="flex items-center justify-between">
                    <a href="#" class="-m-1.5 p-1.5">
                        <span class="sr-only">Your Company</span>
                        <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="">
                    </a>
                    <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700">
                        <span class="sr-only">Close menu</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="mt-6 flow-root">
                    <div class="-my-6 divide-y divide-gray-500/10">
                        <div class="space-y-2 py-6">
                            <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Product</a>
                            <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Features</a>
                            <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Resources</a>
                            <a href="#" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Company</a>
                        </div>
                        <div class="py-6">
                            <a href="#" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">Log in</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <main class="isolate">
        <!-- Hero section -->
        <div class="relative isolate -z-10 overflow-hidden pt-14">
            <div class="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
                <div class="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
                    <h1 class="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-6xl lg:col-span-2 xl:col-auto uppercase">ты можешь изменить все</h1>

                    <!-- Organization Create Form -->
                    <div id="organization-create-form" class="aspect-[6/5] w-full max-w-lg rounded-2xl object-cover lg:max-w-none xl:row-span-2 xl:row-end-2"></div>
                    <!-- END - Organization Create Form -->

                    <div class="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                        <img src="https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80" alt="" class="aspect-[6/5] w-full max-w-lg rounded-2xl object-cover lg:max-w-none xl:row-span-2 xl:row-end-2">
                    </div>
                </div>
            </div>
            <div class="absolute inset-x-0 bottom-0 -z-10 h-24 from-white sm:h-32"></div>
        </div>

        <!-- Timeline section -->
        <div class="mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
            <div class="grid grid-cols-20 grid-rows-3 gap-6">
                <div class="bg-transparent col-span-7"></div>
                <div class="bg-white/20 col-span-6 rounded-2xl">
                    <div class="w-full uppercase text-xl font-bold tracking-tight text-white text-center">голосование</div>
                </div>
                <div class="bg-transparent col-span-7"></div>

                <div class="bg-transparent col-span-1"></div>
                <div class="bg-white/20 col-span-6 rounded-2xl">
                    <div class="w-full uppercase text-xl font-bold tracking-tight text-white text-center">публичные вопросы</div>
                </div>
                <div class="bg-white/20 col-span-6 row-span-2">
                    <img src="https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80" alt="" class="aspect-[9/5] w-full max-w-lg rounded-2xl object-cover">
                </div>
                <div class="bg-white/20 col-span-6 rounded-2xl">
                    <div class="w-full uppercase text-xl font-bold tracking-tight text-white text-center">органы управления и надзора</div>
                </div>
                <div class="bg-transparent col-span-1"></div>

                <div class="bg-white/20 col-span-6 rounded-2xl">
                    <div class="w-full uppercase text-xl font-bold tracking-tight text-white text-center">пользователи</div>
                </div>
                <div class="bg-transparent col-span-1"></div>
                <div class="bg-transparent col-span-1"></div>
                <div class="bg-white/20 col-span-6 rounded-2xl">
                    <div class="w-full uppercase text-xl font-bold tracking-tight text-white text-center">документы</div>
                </div>
            </div>
        </div>
    </main>

    @include('home.footer')
</div>

<script src="{{ mix('js/manifest.js') }} "></script>
<script src="{{ mix('js/vendor.js') }}"></script>
<script src="{{ mix('js/app.js') }}"></script>
<script src="{!! mix('/js/OrganizationCreateForm.js') !!}"></script>
@yield('scripts')
</body>
</html>
