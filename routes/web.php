<?php

use App\Http\Controllers\Auth\Oauth2LoginController;
use App\Http\Controllers\DevController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\ItemsTreeController;
use App\Http\Controllers\StatisticsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

if (app()->isLocal()) {
    Route::get('/dev', [DevController::class, 'index']);
}

Route::get('/', function () {
    return view('welcome');
});

Route::group(['middleware' => ['guest']], function () {
    // Redirect the user to the Provider authentication page.
    Route::get('/login', [Oauth2LoginController::class, 'login'])->name('login');

    // Provider calls this endpoint with the result of the user decision:
    // whether to authorize our client or not. The input will contain
    // either `code` (on success) or `error` on (failure).
    Route::get('/login/callback', [Oauth2LoginController::class, 'login'])->name('login.callback');
});

Route::group(['middleware' => ['auth', 'can:access-app']], function () {
    Route::get('/items/favorites', [ItemsController::class, 'favorites'])->name('items.favorites');

    Route::resource('items', ItemsController::class);

    Route::get('/items/{item}/download', [ItemsController::class, 'download'])->name('items.download');

    Route::get('/statistics', [StatisticsController::class, 'index'])->name('statistics.index');

    Route::get('/statistics/download', [StatisticsController::class, 'download'])->name('statistics.download');

    Route::get('/items-tree', [ItemsTreeController::class, 'index'])->name('items-tree');

    Route::get('/items-tree/getItems', [ItemsTreeController::class, 'getItems'])->name('items-tree.get-items');

    Route::put('/items-tree/updateItemParent', [ItemsTreeController::class, 'updateItemParent'])->name('items-tree.update-item-parent');

    Route::put('/items-tree/updateItemEmployeeOnly', [ItemsTreeController::class, 'updateItemEmployeeOnly'])->name('items-tree.update-item-employee-only');

    Route::put('/items-tree/updateItemName', [ItemsTreeController::class, 'updateItemName'])->name('items-tree.update-item-name');

    Route::post('/items-tree/updateItemThumb', [ItemsTreeController::class, 'updateItemThumb'])->name('items-tree.update-item-thumb');

    Route::post('/items-tree/addYoutubeItem', [ItemsTreeController::class, 'addYoutubeItem'])->name('items-tree.add-youtube-item');

    Route::post('/items-tree/addPdfItem', [ItemsTreeController::class, 'addPdfItem'])->name('items-tree.add-pdf-item');

    Route::delete('/items-tree/removeItem', [ItemsTreeController::class, 'removeItem'])->name('items-tree.remove-item');

    Route::post('/items-tree/addCategory', [ItemsTreeController::class, 'addCategory'])->name('items-tree.add-category');
});
