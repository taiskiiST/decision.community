<?php

use App\Http\Controllers\DevController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\ItemsTreeController;
use App\Http\Controllers\PollsController;
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

Route::get('/', function () {
    return view('welcome');
});

if (app()->isLocal()) {
    Route::get('/dev', [DevController::class, 'index']);
}

Route::get('/polls/{poll}/display', [PollsController::class, 'display'])->name('poll.display');
Route::post('/polls/{poll}/submit', [PollsController::class, 'submit'])->name('poll.submit');
Route::get('/polls/{poll}/results', [PollsController::class, 'results'])->name('poll.results');


Route::group(['middleware' => ['auth', 'can:access-app']], function () {
    Route::resource('items', ItemsController::class);

    Route::get('/polls/{poll}/report_voted', [PollsController::class, 'report_voted'])->name('poll.report_voted');
    Route::get('/polls/{poll}/report', [PollsController::class, 'report'])->name('poll.report');
    Route::get('/polls/{poll}/results_list', [PollsController::class, 'results_list'])->name('poll.results_list');

    Route::get('/items/{item}/download', [ItemsController::class, 'download'])->name('items.download');

    Route::get('/items-tree', [ItemsTreeController::class, 'index'])->name('items-tree');

    Route::get('/items-tree/getItems', [ItemsTreeController::class, 'getItems'])->name('items-tree.get-items');

    Route::put('/items-tree/updateItemParent', [ItemsTreeController::class, 'updateItemParent'])->name('items-tree.update-item-parent');

    Route::put('/items-tree/updateItemEmployeeOnly', [ItemsTreeController::class, 'updateItemEmployeeOnly'])->name('items-tree.update-item-employee-only');

    Route::put('/items-tree/updateItemName', [ItemsTreeController::class, 'updateItemName'])->name('items-tree.update-item-name');
    Route::put('/items-tree/updateItemPhone', [ItemsTreeController::class, 'updateItemPhone'])->name('items-tree.update-item-phone');
    Route::put('/items-tree/updateItemPin', [ItemsTreeController::class, 'updateItemPin'])->name('items-tree.update-item-pin');
    Route::put('/items-tree/updateItemAddress', [ItemsTreeController::class, 'updateItemAddress'])->name('items-tree.update-item-address');
    Route::put('/items-tree/updateItemElementary', [ItemsTreeController::class, 'updateItemElementary'])->name('items-tree.update-item-elementary');
    Route::put('/items-tree/updateItemCommitteeMembers', [ItemsTreeController::class, 'updateItemCommitteeMembers'])->name('items-tree.update-item-committee-members');
    Route::put('/items-tree/updateItemPresidiumMembers', [ItemsTreeController::class, 'updateItemPresidiumMembers'])->name('items-tree.update-item-presidium-members');
    Route::put('/items-tree/updateItemChairman', [ItemsTreeController::class, 'updateItemChairman'])->name('items-tree.update-item-chairman');
    Route::put('/items-tree/updateItemRevCommitteeMembers', [ItemsTreeController::class, 'updateItemRevCommitteeMembers'])->name('items-tree.update-item-rev-committee-members');
    Route::put('/items-tree/updateItemRevPresidiumMembers', [ItemsTreeController::class, 'updateItemRevPresidiumMembers'])->name('items-tree.update-item-rev-presidium-members');
    Route::put('/items-tree/updateItemRevChairman', [ItemsTreeController::class, 'updateItemRevChairman'])->name('items-tree.update-item-rev-chairman');

    Route::post('/items-tree/updateItemThumb', [ItemsTreeController::class, 'updateItemThumb'])->name('items-tree.update-item-thumb');

    Route::post('/items-tree/addItem', [ItemsTreeController::class, 'addItem'])->name('items-tree.add-item');

    Route::post('/items-tree/addPdfItem', [ItemsTreeController::class, 'addPdfItem'])->name('items-tree.add-pdf-item');

    Route::delete('/items-tree/removeItem', [ItemsTreeController::class, 'removeItem'])->name('items-tree.remove-item');

    Route::post('/items-tree/addCategory', [ItemsTreeController::class, 'addCategory'])->name('items-tree.add-category');

    Route::resource('polls', PollsController::class);
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

require __DIR__.'/auth.php';
