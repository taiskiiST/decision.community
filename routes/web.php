<?php

use App\Http\Controllers\ChildrenAndParentsInformation;
use App\Http\Controllers\CompaniesController;
use App\Http\Controllers\DevController;
use App\Http\Controllers\ItemsController;
use App\Http\Controllers\ItemsTreeController;
use App\Http\Controllers\PollsController;
use App\Http\Controllers\QuestionsController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\PositionsController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\HomeController;
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

Route::get('/', [HomeController::class, 'index'])
     ->middleware('guest')
     ->name('home');

Route::get('/404', [Controller::class, 'view404'])->name('404');

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth'])->name('dashboard');

Route::get('/companies/get-existing-uris', [CompaniesController::class, 'getExistingURIs'])->name('companies.get-existing-uris');

Route::group(['middleware' => 'check.company'], function () {
    require __DIR__ . '/auth.php';

    Route::get('/main', [Controller::class, 'main'])->name('main');

    Route::get('polls/view/public/questions', [QuestionsController::class, 'viewPublicQuestions'])->name('questions.view-public-questions');

    Route::get('/polls/view/question/{question}/{search?}', [QuestionsController::class, 'viewQuestion'])->name('poll.questions.view_question');

    Route::get('/polls/view/suggested/questions/', [QuestionsController::class, 'viewSuggestedQuestions'])->name('poll.questions.view_suggested_questions');

    Route::get('/children-and-parents-information/', [ChildrenAndParentsInformation::class, 'index'])->name('children-and-parents-information');
    Route::post('/children-and-parents-information-submit/', [ChildrenAndParentsInformation::class, 'submit'])->name('children-and-parents-information-submit');
    Route::get('/children-and-parents-information-done/', [ChildrenAndParentsInformation::class, 'done'])->name('children-and-parents-information-done');

    Route::get('/children-and-parents-information-school/', [ChildrenAndParentsInformation::class, 'indexSchool'])->name('children-and-parents-information-school');
    Route::post('/children-and-parents-information-school-submit/', [ChildrenAndParentsInformation::class, 'submitSchool'])->name('children-and-parents-information-school-submit');
    Route::get('/children-and-parents-information-school-done/', [ChildrenAndParentsInformation::class, 'doneSchool'])->name('children-and-parents-information-school-done');

    Route::get('/check-parent/', [ChildrenAndParentsInformation::class, 'checkParent'])->name('check-parent');
    Route::get('/report-school/', [ChildrenAndParentsInformation::class, 'schoolReport'])->name('school-report');
    Route::get('/report-school-by-school/', [ChildrenAndParentsInformation::class, 'schoolReportBySchool'])->name('school-report-by-school');
    Route::get('/children-report-age', [ChildrenAndParentsInformation::class, 'reportAge'])->name('children-report-age');

    Route::group(['middleware' => ['auth', 'can:access-app']], function () {
        Route::get('/question/getQuestion', [QuestionsController::class, 'getQuestion'])->name('get.question');
        Route::get('/children-report', [ChildrenAndParentsInformation::class, 'report'])->name('children-report');

        Route::get('/register', [PollsController::class, 'index'])->name('polls.register');

        Route::get('/polls/{poll}/display', [PollsController::class, 'display'])->name('poll.display');
        Route::patch('/polls/{poll}/start', [PollsController::class, 'start'])->name('poll.start');
        Route::post('/polls/{poll}/submit', [PollsController::class, 'submit'])->name('poll.submit');
        Route::get('/polls/{poll}/results', [PollsController::class, 'results'])->name('poll.results');
        Route::post('/polls/create/{type_of_poll}', [PollsController::class, 'create'])->name('poll.create');
        Route::post('/polls/{poll}/edit/{error?}', [PollsController::class, 'edit'])->name('poll.edit');
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
        Route::post('/polls/{poll}/question/{question}/delete', [QuestionsController::class, 'destroy'])->name('question.delete');
        Route::post('/question_suggested/{question}/delete', [QuestionsController::class, 'destroy_suggested'])->name('question_suggested.delete');
        Route::post('/polls/{poll}/questions/add', [PollsController::class, 'addQuestion'])->name('poll.addQuestion');

        Route::get('/polls/search/question/{search?}', [QuestionsController::class, 'searchQuestion'])->name('poll.questions.search_question');
        Route::post('/searchQuestions', [QuestionsController::class, 'searchQuestions'])->name('poll.questions.search_questions');

        Route::post('/polls/{poll}/question/{question}/public', [QuestionsController::class, 'publicQuestion'])->name('question.public');


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
});

