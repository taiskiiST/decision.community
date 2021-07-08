<div class="flex flex-col min-h-2xl">
    <div class="flex flex-col px-4 bg-gray-100 min-h-32">
        <div class="flex items-center justify-between text-gray-500 text-sm mt-4 mb-2 md:mb-4">
            <div class="flex justify-between items-center h-12">
                <div class="mt-1 relative w-40 sm:w-48">
                    <label class="sr-only" for="search">Search Box</label>

                    <input
                        wire:model.debounce.300ms="search"
                        type="search"
                        class="appearance-none shadow border py-2 px-3 text-gray-500 text-sm focus:outline-none focus:shadow-outline w-full"
                        id="search"
                        placeholder="Search"
                        autofocus
                    />

                    <button class="absolute inset-y-0 right-0 flex items-center bg-indigo-600 text-white text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="w-10 h-4" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" stroke="currentColor">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <div class="hidden md:flex mt-1 rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <span>Start</span>

                    <span class="hidden lg:block">&nbsp;Date</span>
                </span>

                <x-date-picker
                    wire:model="startDate"
                    name="startDate"
                    class="w-36 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded-none rounded-r-md text-sm border-gray-300"
                    readonly
                />
            </div>

            <div class="hidden md:flex mt-1 rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <span>End</span>

                    <span class="hidden lg:block">&nbsp;Date</span>
                </span>

                <x-date-picker
                    wire:model="endDate"
                    name="endDate"
                    class="w-36 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded-none rounded-r-md text-sm border-gray-300"
                    readonly
                />
            </div>

            <div class="mt-1 flex flex-row justify-between items-center">
                <a
                    href="{{ $this->downloadUrl }}"
                    class="inline-flex items-center px-2 lg:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="new-item-menu" aria-label="New Item Menu" aria-haspopup="true"
                >
                    <svg class="lg:-ml-1 lg:mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>

                    <span class="hidden lg:block">Download</span>
                </a>
            </div>
        </div>

        <div class="flex flex-wrap md:hidden items-center justify-center sm:justify-between text-gray-500 text-sm mt-2 mb-4">
            <div class="flex mt-1 mx-2 rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <span class="w-8">Start</span>

                    <span class="hidden lg:block">&nbsp;Date</span>
                </span>

                <x-date-picker
                    wire:model="startDate"
                    name="startDate"
                    class="w-36 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded-none rounded-r-md text-sm border-gray-300"
                    readonly
                />
            </div>

            <div class="flex mt-1 mx-2 rounded-md shadow-sm">
                <span class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <span class="w-8">End</span>

                    <span class="hidden lg:block">&nbsp;Date</span>
                </span>

                <x-date-picker
                    wire:model="endDate"
                    name="endDate"
                    class="w-36 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block rounded-none rounded-r-md text-sm border-gray-300"
                    readonly
                />
            </div>
        </div>
    </div>

    <div class="overflow-x-auto">
        <div class="align-middle inline-block min-w-full">
            <div class="shadow overflow-hidden border-b border-gray-200 mt-4">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead>

                    <tr>
                        <th
                            class="px-6 py-3 text-left"
                        >
                            <div class="flex items-center">
                                <button
                                    wire:click="sortBy('users.name')"
                                    class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    User Name
                                </button>

                                <x-sort-icon
                                    field="users.name"
                                    :sortField="$sortField"
                                    :sortAsc="$sortAsc"
                                />
                            </div>
                        </th>

                        <th
                            class="px-6 py-3 text-left"
                        >
                            <div class="flex items-center">
                                <button
                                    wire:click="sortBy('users.email')"
                                    class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    User Email
                                </button>

                                <x-sort-icon
                                    field="users.email"
                                    :sortField="$sortField"
                                    :sortAsc="$sortAsc"
                                />
                            </div>
                        </th>

                        <th
                            class="px-6 py-3 text-left"
                        >
                            <div class="flex items-center">
                                <button
                                    wire:click="sortBy('items.name')"
                                    class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Item Name
                                </button>

                                <x-sort-icon
                                    field="items.name"
                                    :sortField="$sortField"
                                    :sortAsc="$sortAsc"
                                />
                            </div>
                        </th>

                        <th
                            class="px-6 py-3 text-left"
                        >
                            <div class="flex items-center">
                                <button
                                    wire:click="sortBy('count')"
                                    class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Count
                                </button>

                                <x-sort-icon
                                    field="count"
                                    :sortField="$sortField"
                                    :sortAsc="$sortAsc"
                                />
                            </div>
                        </th>
                    </tr>
                    </thead>

                    <tbody class="bg-white divide-y divide-gray-200">
                    @foreach ($visits as $visit)
                        <tr>
                            <td class="w-3/12 px-6 py-4 whitespace-no-wrap">
                                <div class="flex items-center">
                                    <div class="ml-4">
                                        <div class="text-sm leading-5 font-medium text-gray-900">
                                            {{ $visit->userName }}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            <td class="w-4/12 px-6 py-4 whitespace-no-wrap">
                                <div class="text-sm leading-5 text-gray-900">{{ $visit->userEmail }}</div>
                            </td>

                            <td class="w-3/12 px-6 py-4 whitespace-no-wrap">
                                <div class="text-sm leading-5 text-gray-900">{{ $visit->itemName }}</div>
                            </td>

                            <td class="w-2/12 px-6 py-4 whitespace-no-wrap">
                                <div class="text-sm leading-5 text-gray-900">{{ $visit->count }}</div>
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>

            @if ($visits->isNotEmpty())
                <div class="mt-8 mx-4 mb-4">
                    {{ $visits->links() }}
                </div>
            @endif
        </div>
    </div>

</div>
