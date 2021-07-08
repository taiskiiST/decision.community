<button
    type="button"
    class="focus:outline-none"
    wire:click="toggleFavorite({{ $item->id }})"
>
    <span class="hover:text-red-500">
        @if ($item->isFavoredBy(auth()->user()))
            @include('dif.heart-filled-svg')
        @else
            @include('dif.heart-empty-svg')
        @endif
    </span>
</button>



