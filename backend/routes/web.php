<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route untuk halaman utama SPA
Route::get('/{any}', function () {
    return File::get(public_path() . '/dist/index.html');
})->where('any', '.*');

// Route untuk folder aqiqah
Route::get('/aqiqah', function ($any = null) {
    return File::get(public_path() . '/aqiqah/index.html');
});