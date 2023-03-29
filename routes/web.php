<?php

use App\Http\Controllers\DevController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\ItemsTreeController;
use App\Http\Controllers\PollsController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\PositionsController;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;
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
    return redirect()->to('polls');
});

Route::get('/polls', function () {
    return redirect()->route('polls.index');
});

if (app()->isLocal()) {
    Route::get('/dev', [DevController::class, 'index']);
}


Route::get('/polls/view/question/{question}/{search?}', [QuestionsController::class, 'viewQuestion'])->name('poll.questions.view_question');

Route::get('/polls/view/public/questions/', [QuestionsController::class, 'viewPublicQuestions'])->name('poll.questions.view_public_questions');
Route::get('/polls/view/suggested/questions/', [QuestionsController::class, 'viewSuggestedQuestions'])->name('poll.questions.view_suggested_questions');

Route::get('/404', [Controller::class, 'view404'])->name('404');

Route::group(['middleware' => ['auth', 'can:access-app']], function () {
    //dd(Route::current());
    Route::get('/polls/{poll}/display', [PollsController::class, 'display'])->name('poll.display');
    Route::get('/polls/{poll}/display_report', [PollsController::class, 'display_report'])->name('poll.display_report');
    Route::get('/polls/{poll}/start', [PollsController::class, 'start'])->name('poll.start');
    Route::get('/polls/{poll_id?}/index/{id_question?}', [PollsController::class, 'index'])->name('polls.index');
    Route::post('/polls/{poll}/submit', [PollsController::class, 'submit'])->name('poll.submit');
    Route::get('/polls/{poll}/results', [PollsController::class, 'results'])->name('poll.results');
    Route::post('/polls/create/{type_of_poll}', [PollsController::class, 'create'])->name('poll.create');
    Route::get('/polls/{poll}/edit/{error?}', [PollsController::class, 'edit'])->name('poll.edit');
    Route::post('/polls/{poll}/generateProtocol', [PollsController::class, 'generateProtocolWithOutTemplate'])->name('poll.generateProtocol');
    Route::post('/polls/{poll}/generateBlank', [PollsController::class, 'generateBlankWithOutTemplate'])->name('poll.generateBlank');
    Route::post('/polls/{poll}/generateBlankWithAnswers', [PollsController::class, 'generateBlankWithAnswersWithOutTemplate'])->name('poll.generateBlankWithAnswers');
    Route::post('/polls/{poll}/addProtocol', [PollsController::class, 'addProtocol'])->name('poll.addProtocol');
    Route::get('/polls/{poll}/delProtocol', [PollsController::class, 'delProtocol'])->name('poll.delProtocol');
    Route::post('/polls/delete/{poll}', [PollsController::class, 'delete'])->name('poll.delete');
    Route::post('/polls/store', [PollsController::class, 'store'])->name('poll.store');
    Route::post('/polls/{poll}/end', [PollsController::class, 'endVote'])->name('poll.endVote');
    Route::get('/polls/{poll}/agenda/public', [PollsController::class, 'agenda'])->name('poll.agenda');

    Route::get('/polls/{poll}/requisites/', [PollsController::class, 'requisites'])->name('poll.requisites');
    Route::get('/polls/{poll}/requisites/submitName', [PollsController::class, 'requisitesSubmitName'])->name('poll.requisites.submitName');
    Route::get('/polls/{poll}/requisites/submitOrganizers', [PollsController::class, 'requisitesSubmitOrganizers'])->name('poll.requisites.submitOrganizers');
    Route::get('/polls/{poll}/requisites/submitInvited', [PollsController::class, 'requisitesSubmitInvited'])->name('poll.requisites.SubmitInvited');

    Route::get('/polls/{poll}/display/public', [PollsController::class, 'display'])->name('poll.display.public');
    Route::get('/polls/{poll}/results/public', [PollsController::class, 'results'])->name('poll.results.public');
    Route::post('/polls/{poll}/submit/public', [PollsController::class, 'submit'])->name('poll.submit.public');

    Route::get('/polls/{poll}/report_voted', [PollsController::class, 'report_voted'])->name('poll.report_voted');
    Route::get('/polls/{poll}/report_dont_voted', [PollsController::class, 'report_dont_voted'])->name('poll.report_dont_voted');
    Route::get('/polls/{poll}/report', [PollsController::class, 'report'])->name('poll.report');
    Route::get('/polls/{poll}/results_list', [PollsController::class, 'results_list'])->name('poll.results_list');

    Route::get('/polls/{poll}/questions/{id_question?}/{error?}', [QuestionsController::class, 'index'])->name('poll.questions.index');
    Route::get('/polls/{poll}/questions/create', [QuestionsController::class, 'create'])->name('poll.questions.create');
    Route::post('/polls/{poll}/question/{question}/delete/', [QuestionsController::class, 'destroy'])->name('question.delete');
    Route::post('/question_suggested/{question}/delete/', [QuestionsController::class, 'destroy_suggested'])->name('question_suggested.delete');
    Route::post('/polls/{poll}/questions/add', [PollsController::class, 'addQuestion'])->name('poll.addQuestion');

    Route::get('/polls/search/question/{search?}', [QuestionsController::class, 'searchQuestion'])->name('poll.questions.search_question');
    Route::post('/searchQuestions', [QuestionsController::class, 'searchQuestions'])->name('poll.questions.search_questions');

    Route::post('/polls/{poll}/question/{question}/public/', [QuestionsController::class, 'publicQuestion'])->name('question.public');

    //Route::get('/polls/{poll}/questions/add', [QuestionsController::class, 'add'])->name('poll.questions.add');

    Route::get('/profile', [UsersController::class, 'indexProfile'])->name('users.profile');
    Route::get('/profile-update', [UsersController::class, 'updateProfile'])->name('users.profile.update');
    Route::get('/profile-submit-update', [UsersController::class, 'submitUpdateProfile'])->name('users.profile.submit.update');

    Route::get('/manage/users', [UsersController::class, 'index'])->name('users.manage');
    Route::get('/manage/add', [UsersController::class, 'addOrUpdateForm'])->name('users.add');
    Route::post('/manage/update', [UsersController::class, 'addOrUpdateForm'])->name('user.update');
    Route::post('/manage/delete', [UsersController::class, 'delete'])->name('users.delete');
    Route::post('/manage/addOrUpdate', [UsersController::class, 'addOrUpdate'])->name('users.addOrUpdate');
    Route::get('/governance', [UsersController::class, 'governance'])->name('users.governance');
    Route::get('/governance/manage', [UsersController::class, 'governanceManage'])->name('users.governance.manage');
    Route::get('/position/manage', [PositionsController::class, 'positionManage'])->name('position.manage');
    Route::post('/position/update', [PositionsController::class, 'positionUpdate'])->name('position.update');
    Route::post('/position/update/submit', [PositionsController::class, 'positionUpdateSubmit'])->name('position.update.submit');
    Route::post('/position/add', [PositionsController::class, 'positionAdd'])->name('position.add');
    Route::post('/position/add/submit', [PositionsController::class, 'positionAddSubmit'])->name('position.add.submit');
    Route::post('/position/delete', [PositionsController::class, 'positionDelete'])->name('position.delete');

    Route::resource('items', ItemsController::class);
    Route::get('/items/{item}/download', [ItemsController::class, 'download'])->name('items.download');

    Route::get('/items-tree', [ItemsTreeController::class, 'index'])->name('items-tree');

    Route::get('/items-tree/getItems', [ItemsTreeController::class, 'getItems'])->name('items-tree.get-items');

    Route::put('/items-tree/updateItemParent', [ItemsTreeController::class, 'updateItemParent'])->name('items-tree.update-item-parent');

    Route::put('/items-tree/updateItemEmployeeOnly', [ItemsTreeController::class, 'updateItemEmployeeOnly'])->name('items-tree.update-item-employee-only');

    Route::put('/items-tree/updateItemName', [ItemsTreeController::class, 'updateItemName'])->name('items-tree.update-item-name');
    Route::put('/items-tree/updateItemPhone', [ItemsTreeController::class, 'updateItemPhone'])->name('items-tree.update-item-phone');
    Route::put('/items-tree/updateItemCost', [ItemsTreeController::class, 'updateItemCost'])->name('items-tree.update-item-cost');
    Route::put('/items-tree/updateItemDescription', [ItemsTreeController::class, 'updateItemDescription'])->name('items-tree.update-item-description');
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


Route::group(['domain' => '{subdomain}.'.env('APP_URL')], function () {
    Route::get('{never_used?}', function ($subdomain, $never_used = null) {
        $company = \App\Models\Company::where('uri', $subdomain)->first();
        if ($company){
            if (!auth()->user()){
                return view('auth.login', ['company_id' => $company->id]);
            }
        }else{
            return Redirect::to(env('APP_URL').'/404');
        }
    })->where('never_used', '.*')
    ;
});


require __DIR__.'/auth.php';
