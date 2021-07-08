@component('mail::message')
@if ($item->isPdf())
# {{ $item->name }}
@else
# <a href="{{ $item->source }}" alt="Item Source" target="_blank">{{ $item->name }}</a>
@endif

![ItemImage]({{ config('app.url') . '/' . $item->thumbUrl() }})

Thanks,<br>
{{ $user->name }}
@endcomponent
