<!-- This example requires Tailwind CSS v2.0+ -->
<div wire:key="manage-items-modal" class="{{ $isManageItemsModalOpen ? 'block' : 'hidden' }} fixed z-10 inset-0 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

        <button
            wire:click="$set('isManageItemsModalOpen', false)"
            type="button"
            class="{{ $isManageItemsModalOpen ? 'block' : 'hidden' }} fixed inset-0 h-full w-full cursor-default z-20"
            tabindex="-1">
        </button>

        <!--
          Background overlay, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100"
            To: "opacity-0"
        -->
        <div class="{{ $isManageItemsModalOpen ? 'block' : 'hidden' }} fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <!--
          Modal panel, show/hide based on modal state.

          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
        <div
            class="{{ $isManageItemsModalOpen ? 'inline-block' : 'hidden' }} relative z-30 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline"
        >
            @if ($itemTypeBeingAdded === \App\Models\Item::TYPE_YOUTUBE_VIDEO)
                <livewire:add-youtube-video-form :parentItemId="$parentItemId" />
            @elseif ($itemTypeBeingAdded === \App\Models\Item::TYPE_PDF)
                <livewire:add-pdf-form :parentItemId="$parentItemId" />
            @endif
        </div>
    </div>
</div>
