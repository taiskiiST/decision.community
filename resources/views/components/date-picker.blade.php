<input
    wire:ignore
    x-data
    x-ref="input"
    x-init="new Pikaday({
        field: $refs.input,
        onSelect: function() {
            Livewire.emit($refs.input.name + 'Selected', this.toString('YYYY-MM-DD'));
        },
    })"
    type="text"
    {{ $attributes }}
>
