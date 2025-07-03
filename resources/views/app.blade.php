<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>ecommerce</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet" />
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx'])
        <script src="https://cdn.tiny.cloud/1/bip7ep5e6b0pc6532enblabnd8eh8160arcae0p058nwb73e/tinymce/7/tinymce.min.js" referrerpolicy="origin"></script>
    </head>
    <body class="font-sans Rubik">
        <div id="app"></div>
    </body>
</html>
