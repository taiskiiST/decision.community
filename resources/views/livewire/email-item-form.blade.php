<form wire:submit.prevent="submitForm" action="#" method="POST">
    @csrf

    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 bg-indigo-300">
                <span class="text-indigo-700">
                    <svg class="w-6 h-6" enable-background="new 0 0 32 32" stroke="currentColor" id="Layer_1" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <path d="M31.543,0.16C31.377,0.053,31.188,0,31,0c-0.193,0-0.387,0.055-0.555,0.168l-30,20  c-0.309,0.205-0.479,0.566-0.439,0.936c0.038,0.369,0.278,0.688,0.623,0.824l7.824,3.131l3.679,6.438  c0.176,0.309,0.503,0.5,0.857,0.504c0.004,0,0.007,0,0.011,0c0.351,0,0.677-0.186,0.857-0.486l2.077-3.463l9.695,3.877  C25.748,31.977,25.873,32,26,32c0.17,0,0.338-0.043,0.49-0.129c0.264-0.148,0.445-0.408,0.496-0.707l5-30  C32.051,0.771,31.877,0.377,31.543,0.16z M3.136,20.777L26.311,5.326L9.461,23.363c-0.089-0.053-0.168-0.123-0.266-0.162  L3.136,20.777z M10.189,24.066c-0.002-0.004-0.005-0.006-0.007-0.01L29.125,3.781L12.976,28.943L10.189,24.066z M25.217,29.609  l-8.541-3.416c-0.203-0.08-0.414-0.107-0.623-0.119L29.205,5.686L25.217,29.609z" fill="#333333" id="paperplane"/>
                    </svg>
                </span>
            </div>

            <div class="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Email Item
                </h3>

                <div class="mt-2">
                    <label for="email_address" class="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>

                    <div class="mt-1 flex flex-col rounded-md shadow-sm">
                        <input
                            wire:model.debounce.300ms="emailAddressesString"
                            wire:loading.attr="disabled"
                            wire:target="submitForm"
                            type="text"
                            name="email_address"
                            id="email_address"
                            class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-md sm:text-sm border-gray-300"
                            placeholder="email@address.com"
                        >

                        <p class="text-gray-500 text-xs">Use a semicolon to add several recipients</p>
                    </div>

                    @error('emailAddressesString')
                        <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                    @enderror
                </div>

                <div
                    wire:loading.delay
                    wire:target="submitForm"
                    class="flex justify-center w-full"
                >
                    @include('dif.loading-indicator')
                </div>

                @if ($errorMessage)
                    <p class="text-red-500 text-sm mt-1">{{ $errorMessage }}</p>
                @endif

                @if ($sizeWarning)
                    <p class="text-yellow-600 text-sm mt-2">
                        {{ $sizeWarning }}
                    </p>
                @endif
            </div>
        </div>
    </div>

    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
            wire:loading.attr="disabled"
            wire:loading.class="bg-gray-200 opacity-50"
            wire:target="submitForm"
            type="submit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
            Отправить
        </button>

        <button
            wire:click="$emitUp('emailItemModalCancelButtonClicked')"
            wire:loading.class="bg-gray-200 opacity-50"
            wire:loading.attr="disabled"
            wire:target="submitForm"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
            Отмена
        </button>
    </div>
</form>
