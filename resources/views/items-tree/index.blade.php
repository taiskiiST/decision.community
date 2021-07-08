@extends('layouts.app', [
    'headerName' => 'Manage Items',
])

@section('content')
    <div id="manage-items-root"></div>
@endsection

@section('scripts')
    @parent
    <script src="{{ mix('js/ManageItems.js') }}"></script>
@endsection
