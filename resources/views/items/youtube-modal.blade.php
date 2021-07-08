<div wire:key="youtube-item-modal" class="fixed z-10 inset-0 overflow-y-auto">
    <div class="flex flex-col items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center">
        <button
            wire:click="$set('isYoutubeModalOpen', false)"
            type="button"
            class="fixed inset-0 h-full w-full cursor-default z-20"
            tabindex="-1"
        >
        </button>

        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>

        <div
            class="inline-block relative z-30 rounded-lg overflow-hidden shadow-xl transform transition-all w-95% md:max-w-75%"
            role="dialog" aria-modal="true" aria-labelledby="modal-headline"
        >
            <div
                class="pb-56.25% relative h-0 overflow-hidden max-w-full"
            >
                <iframe
                    class="w-full h-full absolute top-0 left-0"
                    src="{{ $videoSource }}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
            </div>
        </div>
    </div>
</div>
