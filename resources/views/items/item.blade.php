<div class="group w-72 h-80 px-4 py-2">
    @if ($item->isCategory())
        @include('items.image-wrapper-a', ['item' => $item, 'url' => $item->path(), 'target' => '_self'])
    @else
        @include('items.image-wrapper-button', ['item' => $item])
    @endif

    <div>
        <div class="flex justify-center items-center pt-2 text-gray-700 group-hover:text-blue-500 font-semibold leading-tight">
            <div class="w-48 text-center truncate">
                <a
                    href="{{ $item->isCategory() ? $item->path() : '#' }}"
                    target="_self"
                    class="hover:text-blue-500"
                >
                    {{ $item->name }}
                </a>
            </div>
        </div>

        <span class="flex justify-center items-center text-gray-600 text-sm">
            @if ($item->isCategory())
                {{ $countItems = $item->countItemsAvailableToUser() }} шт

                <svg class="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            @else
                <svg
                    xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            @endif
        </span>
        <div class="flex-col justify-center pt-2 text-gray-700 group-hover:text-blue-500 font-semibold leading-tight">
            @if ($item->address)
                <div class="text-center">
                    Адрес: {{$item->address}}
                </div>
            @endif
            @if ($item->phone)
                <div class="text-center pt-2">
                    Телефон: {{$item->phone}}
                </div>
            @endif
            @if ($item->pin)
                <div class="text-center pt-2">
                    Цена: {!! $item->pin !!}
                </div>
            @endif
            @if ($item->description)
                <div class="pt-2">
                    {!! $item->description !!}
                </div>
            @endif
        </div>
    </div>
</div>
