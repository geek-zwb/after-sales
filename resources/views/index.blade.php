<?php
/**
 * Created by PhpStorm.
 * User: Geek-zwb
 * Date: 2016/11/18 0018
 * Time: 上午 11:02
 * 首页
 */
?>
@extends('layouts.base')
@section('css')
    {{--bootstrap.css and font-awesome.css--}}
    <link rel="stylesheet" href="{!! elixir('css/less.css') !!}">

    {{--adminLTE require css file--}}
    <link rel="stylesheet" href="/libs/ionicons/2.0.1/css/ionicons.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="/dist/css/AdminLTE.min.css">
    <link rel="stylesheet" href="/dist/css/skins/skin-blue.min.css">

    <!--[if lte IE 10]>
    <script type="text/javascript">document.location.href = '/unsupported-browser'</script>
    <![endif]-->

    <link rel="stylesheet" href="{!! elixir('css/vendor.css') !!}">
    <link rel="stylesheet" href="{!! elixir('css/app.css') !!}">
@endsection

@section('js')
    <script src="{!! elixir('js/vendor.js') !!}"></script>

    <!-- AdminLTE App -->
    <script src="/dist/js/app.min.js"></script>

    <script src="{!! elixir('js/partials.js') !!}"></script>

    <script src="{!! elixir('js/appinit.js') !!}"></script>
    <script src="{!! elixir('js/app.js') !!}"></script>

    {{--livereload--}}
    @if ( env('APP_ENV') === 'local' )
        <script type="text/javascript">
            document.write('<script src="'+ location.protocol + '//' + (location.host.split(':')[0] || 'localhost') +':35729/livereload.js?snipver=1" type="text/javascript"><\/script>')
        </script>
    @endif
@endsection

@section('content')
    <div ui-view></div>
@endsection

