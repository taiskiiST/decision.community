<div wire:key="email-item-modal" class="{{ $isEmailItemModalOpen ? 'block' : 'hidden' }} fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <button
            wire:click="$set('isEmailItemModalOpen', false)"
            type="button"
            class="{{ $isEmailItemModalOpen ? 'block' : 'hidden' }} fixed inset-0 h-full w-full cursor-default z-20"
            tabindex="-1">
        </button>

        <div class="{{ $isEmailItemModalOpen ? 'block' : 'hidden' }} fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
            class="{{ $isEmailItemModalOpen ? 'inline-block' : 'hidden' }} relative z-30 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline"
        >
            <livewire:email-item-form />
        </div>
    </div>
</div>
