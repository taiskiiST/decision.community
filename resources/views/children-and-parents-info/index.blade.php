@extends('layouts.app', [
    'headerName' => 'Сбор информации для школьного автобуса',
])

@section('content')
    @if($errors->any())
        <div class="alert-danger">
            <ul>
                @foreach($errors->all() as $error)
                    <li>
                        <b><p style="color: red">{{$error}} </p></b>
                    </li>
                @endforeach
            </ul>
        </div>
    @endif
    <div class="bg-white overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
            <h1 class="text-lg leading-6 font-bold text-gray-900 text-center">
                Школьный автобус для детей нашего поселка
            </h1>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                <p style="text-indent: 2rem;text-align: justify;">
                По информации Мясниковской администрации примерно через 2 года к 2025 году будет построен новый корпус в Ленинаванской школе.
                </p>
                <p style="text-indent: 2rem;text-align: justify;">
                Мы хотим чтобы все наши дети вместе гуляли, общались, дружили, росли и учились так же вместе! Если заранее заявить о
                наших планах министреству образования, то мы можем добиться, чтобы все наши дети учились вместе.
                </p>
                <p style="text-indent: 2rem;text-align: justify;">
                Но и это еще не все! Правление ТСН КП "Березка" ставит перед собой цель добиться организации школьного автобуса для детей нашего поселка.
                Такой автобус забирал бы детей с нашего послека сначала в первую смену, отвозил всех детей вместе в школу.
                Затем приезжал бы за второй сменой на поселок, так же организованно отвозил детей второй смены в школу, попутно
                забирая от туда детей после первой смены и отвозя их домой. И уже в концу дня забирал детей из школы со второй смены
                и привозил бы их домой на наш поселок.
                </p>
                <p style="text-indent: 2rem;text-align: justify;">
                Чтобы организовать подобный проект масштабный проект необходимо собрать информацию о всех детях проживающих на нашем поселке,
                которые будут ходить в школу через два года. К тому времени все дети, желающие ходить в Ленинаванскую школу, должны будут быть
                происаны по месту фактического проживания на поселке! Остальную же часть работы по согласованию с администрацией местного
                самоуправления и министерством образования Правление ТСН берет на себя!
                </p>
                <p style="text-indent: 2rem;text-align: justify;">
                Для участия в проекте совместного устройства детей в Ленинаванскую школу и организацию для них школьного автобуса
                заполните форму статистического учета детей и их родителей ниже.</p>
            </h3>
        </div>
    </div>
    <div id="children-and-parents-information"></div>
@endsection

@section('scripts')
    @parent()
    <script src="{!! mix('/js/ChildrenAndParentsInformation.js') !!}"></script>
@endsection