<div class="flex flex-col min-h-2xl">
    @includeWhen(auth()->user()->canManageItems(), 'items.manage-items-modal', [
        'isManageItemsModalOpen' => $isManageItemsModalOpen,
        'itemType' => $itemTypeBeingAdded,
        'parentItemId' => $currentCategory ? $currentCategory->id : null,
    ])

    @include('items.email-item-modal', [
        'isEmailItemModalOpen' => $isEmailItemModalOpen,
    ])

    <div class="flex flex-col px-4 bg-gray-100 min-h-32">
        <div class="text-gray-500 font-bold my-4" aria-label="Breadcrumb">
            <ol class="list-none p-0 inline-flex flex-wrap">
                <li class="flex items-center">
                    <a href="{{ route('items.index') }}">Корень</a>

                    @include('dif.chevron-right-svg')
                </li>

                @foreach ($this->parentCategories as $parentCategory)
                    <li class="flex items-center">
                        <a href="{{ $parentCategory->path() }}">{{ $parentCategory->name }}</a>

                        @include('dif.chevron-right-svg')
                    </li>
                @endforeach

                @if ($currentCategory)
                    <li>
                        <a href="{{ $currentCategory->path() }}" class="text-blue-500" aria-current="page">{{ $currentCategory->name }}</a>
                    </li>
                @endif
            </ol>
        </div>

        <div class="flex items-center justify-between text-gray-500 text-sm mb-4">
            <div class="flex justify-between items-center h-12">
                <div class="relative w-48">
                    <label class="sr-only" for="search">Search Box</label>

                    <input
                        wire:model.debounce.300ms="search"
                        type="search"
                        class="appearance-none shadow border py-2 px-3 text-gray-500 focus:outline-none focus:shadow-outline w-full"
                        id="search"
                        placeholder="Поиск"
                        autofocus
                    />

                    <button class="absolute inset-y-0 right-0 flex items-center bg-indigo-600 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="w-10 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" stroke="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="flex flex-row justify-between items-center">
                <div class="hidden sm:block relative ml-4">
                    <button
                        wire:click="toggleSortByDropdown"
                        type="button"
                        class="flex justify-between items-center px-3 focus:outline-none focus:shadow-outline hover:text-blue-500"
                        id="sort-menu" aria-label="Sort Menu" aria-haspopup="true"
                    >
                        <span>
                            Сортировка
                        </span>

                        <span class="ml-3 flex items-center pr-2 pointer-events-none">
                            <svg class="align-top w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </button>

                    <button
                        wire:click="$set('isSortByDropdownOpen', false)"
                        type="button"
                        class="{{ $isSortByDropdownOpen ? 'block' : 'hidden' }} fixed inset-0 h-full w-full cursor-default z-20"
                        tabindex="-1">
                    </button>

                    <div class="{{ $isSortByDropdownOpen ? 'block' : 'hidden' }} origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg z-20">
                        <div class="py-1 rounded-md bg-white shadow-xs" role="menu" aria-orientation="vertical" aria-labelledby="sort-menu">
                            <button
                                wire:click="sortBy('{{ \App\Http\Livewire\ItemsList::SORT_BY_LATEST }}')"
                                type="button"
                                class="relative block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:shadow-outline" role="menuitem"
                            >
                                {{ \App\Http\Livewire\ItemsList::SORT_BY_LATEST }}

                                @includeWhen($sortBy === \App\Http\Livewire\ItemsList::SORT_BY_LATEST, 'dif.icon-selected')
                            </button>

                            <button
                                wire:click="sortBy('{{ \App\Http\Livewire\ItemsList::SORT_ALPHABETICALLY }}')"
                                type="button"
                                class="relative block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:shadow-outline" role="menuitem"
                            >
                                {{ App\Http\Livewire\ItemsList::SORT_ALPHABETICALLY }}

                                @includeWhen($sortBy === \App\Http\Livewire\ItemsList::SORT_ALPHABETICALLY, 'dif.icon-selected')
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="px-12">
        @includeWhen(! empty($successMessage), 'dif.success-message', ['successMessage' => $successMessage])
    </div>

    <div class="flex-1">
        <div class="flex flex-wrap p-5 justify-center items-center space-y-4">
            @forelse ($items as $item)
                @include ('items.item', [
                    'item' => $item,
                ])
            @empty
                Ничего не найдено
            @endforelse
        </div>
    </div>

</div>
