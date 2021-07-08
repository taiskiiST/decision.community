<div class="group w-72 h-80 px-4 py-2">
    @if ($item->isCategory())
        @include('items.image-wrapper-a', ['item' => $item, 'url' => $item->path(), 'target' => '_self'])
    @elseif ($item->isPdf())
        @include('items.image-wrapper-a', ['item' => $item, 'url' => $item->pdfUrl(), 'target' => '_blank'])
    @else
        @include('items.image-wrapper-button', ['item' => $item])
    @endif

    <div>
        <div class="flex justify-center items-center pt-2 text-gray-700 group-hover:text-blue-500 font-semibold leading-tight">
            <div class="w-48 text-center truncate">
                <a
                    wire:click="itemClicked('{{ $item->id }}')"
                    href="{{ $item->isCategory() ? $item->path() : ($item->isPdf() ? $item->pdfUrl() : '#') }}"
                    target="{{ $item->isPdf() ? '_blank' : '_self' }}"
                    class="hover:text-blue-500"
                >
                    {{ $item->name }}
                </a>
            </div>
        </div>

        <span class="flex justify-center items-center text-gray-600 text-sm">
            @if ($item->isCategory())
                {{ $countItems = $item->countItemsAvailableToUser() }} item{{ $countItems === 1 ? '' : 's' }}

                <svg class="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>

                @includeWhen($item->isEmployeeOnly(), 'dif.lock-open-svg')
            @elseif ($item->isPdf())
                <svg class="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>

                @includeWhen($item->isEmployeeOnly(), 'dif.lock-open-svg')

                @include('items.email-item-button')

                @include('items.favorite-button')
            @elseif ($item->isYoutubeVideo())
                <svg class="w-5 h-5 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>

                @includeWhen($item->isEmployeeOnly(), 'dif.lock-open-svg')

                @include('items.email-item-button')

                @include('items.favorite-button')
            @endif
        </span>
    </div>
</div>
