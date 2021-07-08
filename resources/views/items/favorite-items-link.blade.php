<div class="group w-72 h-80 px-4 py-2 mt-4">
    <a
        href="{{ route('items.favorites') }}"
        class="rounded-full focus:outline-none"
    >
        <div class="relative">
            <span class="rounded-full absolute top-0 left-0 h-full w-full opacity-0 hover:opacity-100 bg-gradient-to-tr from-black-65-opacity to-transparent"></span>

            <img class="bg-teal-100 object-cover rounded-full" src="/images/heart-love-favorite_icon.png" alt="Favorites" />
        </div>
    </a>

    <div>
        <div class="flex justify-center items-center pt-2 text-gray-700 group-hover:text-blue-500 font-semibold leading-tight">
            <div class="w-48 text-center truncate">
                <a
                    href="{{ route('items.favorites') }}"
                    class="hover:text-blue-500"
                >
                    Favorites
                </a>
            </div>
        </div>

        <span class="flex justify-center items-center text-gray-600 text-sm">
            @include('dif.heart-filled-svg')
        </span>
    </div>
</div>
