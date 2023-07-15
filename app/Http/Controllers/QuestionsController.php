<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Poll;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuestionsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $error = '';
        if (preg_match('/\/polls\/(\d+)\/questions\/(\d*)\/(.*?$)/', $request->getRequestUri(), $arr_index_poll_and_question)) {
            $poll = Poll::find($arr_index_poll_and_question[1]);
            $question = $poll->questions()->where('id', $arr_index_poll_and_question[2])->get();//ID question
            $error = rawurldecode($arr_index_poll_and_question[3]);
        } elseif (preg_match('/\/polls\/(\d+)\/questions\/(\d*)/', $request->getRequestUri(), $arr_index_poll_and_question)) {
            $poll = Poll::find($arr_index_poll_and_question[1]);
            $question = $poll->questions()->where('id', $arr_index_poll_and_question[2])->get();//ID question
        }
        if (isset($question[0])) {
            $count = 0;
            foreach ($poll->questions()->get() as $question_poll) {
                $count++;
                if ($question_poll->id == $question[0]->id) {
                    break;
                }
            }

            $files = [];
            foreach ($question[0]->question_files()->get() as $file) {
                preg_match('/\..*$/', $file->path_to_file, $matches_type_of_file);
                $type_of_file = str_replace(".", '', $matches_type_of_file[0]);
                $type = $this->switchTypeFile($type_of_file);

                array_push($files, [
                    'file_id'         => $file->id,
                    'fileUpload'      => [
                        0 => [
                            'lastModified'       => $file->updated_at,
                            'lastModifiedDate'   => Storage::disk('public')->lastModified($file->path_to_file),
                            'name'               => Storage::url($file->path_to_file),
                            'size'               => Storage::disk('public')->size($file->path_to_file),
                            'type'               => '',
                            'webkitRelativePath' => '',
                        ],
                    ],
                    'isValidText'     => true,
                    'text'            => $file->text_for_file,
                    'isValidFileSize' => true,
                    'isValidFileName' => true,
                    'hideDragAndDrop' => true,
                    'fileInputRef'    => true,
                    'type'            => $type,
                    'siFromStorage'   => true,
                    'fileLoaded'      => false,
                ]);
            }
        }

        //{guid: 'guid', text: 'Answer', isValidText: false}
        $answers = [];
        if (isset($question[0])) {
            foreach ($question[0]->answers()->get() as $answer) {
                array_push($answers, [
                    'answer_id'   => $answer->id,
                    'text'        => $answer->text,
                    'isValidText' => true,
                ]);
            }
        }
        if (!isset($count)) {
            $count = '';
        }

        \JavaScript::put([
            'poll'                 => $poll,
            'count_question'       => $poll->questions()->count(),
            'current_num_question' => $count,
            'csrf_token'           => csrf_token(),
            'question'             => isset($question[0])
                ? $question[0]
                : '',
            'files'                => isset($question[0])
                ? $files
                : '',
            'answer'               => isset($question[0])
                ? $answers
                : '',
            'error'                => $error,
            'isReport'             => $poll->isReportDone(),
            'isSuggestedQuestion'  => $poll->isSuggestedQuestion(),
        ]);
        return view('questions.create');
    }

    public function viewQuestion(Question $question, $search = '')
    {
        if (!session('current_company') && !$question->public) {
            return redirect()->route('polls.index');
        }

        if ($question->public) {
            return view('questions.view_question', [
                'question' => $question,
                'poll'     => $question->poll()->get()->first(),
                'search'   => $search ? $search : '',
            ]);
        } else {
            if (auth()->user()) {
                return view('questions.view_question', [
                    'question' => $question,
                    'poll'     => $question->poll()->get()->first(),
                    'search'   => $search ? $search : '',
                ]);
            } else {
                return redirect()->route('login');
            }
        }
    }

//    public function viewPublicQuestions()
//    {
////        if(!session('current_company')){
////            return redirect()->route('polls.index');
////        }
//        dd(Route::);
//        $public_questions = Question::where('public', 1)->where('company_id',session('current_company')->id)->get();
//        return view('questions.public_questions', [
//            'public_questions' => $public_questions
//        ]);
//
//    }

    public function viewSuggestedQuestions()
    {
        if (!session('current_company')) {
            return redirect()->route('polls.index');
        }
        $suggested_questions = Question::where('suggest', 1)->where('company_id', session('current_company')->id)->get();
        foreach ($suggested_questions as $question) {
            $cnt_files_in_question [$question->id] = $question->question_files()->count();
        }
        foreach ($suggested_questions as $question) {
            $hashUserVoteQuestions [$question->id] = Poll::find($question->poll_id)->authUserVote();
        }
        if ($suggested_questions->count() == 0) {
            $cnt_files_in_question = [];
            $hashUserVoteQuestions = [];
        }
        //dd($hashUserVoteQuestions);
        \JavaScript::put([
            'csrf_token'            => csrf_token(),
            'itemsNameHash'         => Company::find(session('current_company')->id)->users()->get()->pluck('name', 'id'),
            'itemsPollNameHash'     => Poll::where('company_id', session('current_company')->id)->get()->pluck('name', 'id'),
            'itemsPollFinishedHash' => Poll::where('company_id', session('current_company')->id)->get()->pluck('finished', 'id'),
            'suggested_questions'   => $suggested_questions,
            'hasOwnQuestions'       => Question::hasOwnQuestions($suggested_questions),
            'authUserId'            => auth()->user()->id,
            'cnt_files_in_question' => $cnt_files_in_question,
            'isAuthUserVote'        => $hashUserVoteQuestions,
        ]);

        return view('questions.suggested_questions', [
            'itemsNameHash'       => Company::find(session('current_company')->id)->users()->get()->pluck('name', 'id'),
            'itemsPollNameHash'   => Poll::where('company_id', session('current_company')->id)->get()->pluck('name', 'id'),
            'suggested_questions' => $suggested_questions,
        ]);

    }

    public function searchQuestion(Request $request, $search = '')
    {

        $search_text = $request->search;
        if ($search) {
            $search_text = $search;
        }
        $matches_questions = Question::where('text', 'LIKE', '%' . $search_text . '%')->get();
        //dd($matches_questions);
        return view('questions.search', ['questions' => $matches_questions, 'search_text' => $search_text]);
    }

    public function searchQuestions(Request $request)
    {
        $search_text = $request->searchQuestionsText;
        if (!$search_text) {
            return '';
        }
        $matches_questions = Question::where('text', 'LIKE', '%' . $search_text . '%')->get();
        return $matches_questions;
    }

    public function switchTypeFile($type_of_file)
    {
        switch ($type_of_file) {
            case 'pdf':
                return $type_of_file;
            case 'png':
                return 'img';
            case 'jpg':
                return 'img';
            case 'jpeg':
                return 'img';
            case 'svg':
                return 'img';
            case 'bmp':
                return 'img';
            default:
                return 'other';

        }
    }

    public function publicQuestion(Poll $poll, Question $question)
    {
        if ($question->public) {
            $question->update(['public' => 0]);
        } else {
            $question->update(['public' => 1]);
        }
        return redirect()->route('poll.edit', [
            'poll' => $poll,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function suggestedcreate(Poll $poll)
    {
        \JavaScript::put([
            'poll'           => $poll,
            'count_question' => $poll->questions()->count(),
            'csrf_token'     => csrf_token(),
        ]);

        return view('questions.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * add a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Response
     */
    public function add(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Question $question
     *
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Question $question
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Question $question
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Question $question
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Poll $poll, Question $question)
    {
        foreach ($question->question_files()->get() as $file) {
            Storage::disk('public')->delete($file->path_to_file);
        }
        $question->delete();
        return redirect()->route('poll.edit', [
            'poll' => $poll,
        ]);
    }

    public function destroy_suggested(Question $question)
    {
        // dd($question);
        foreach ($question->question_files()->get() as $file) {
            Storage::disk('public')->delete($file->path_to_file);
        }
        $poll = Poll::find($question->poll_id);
        $question->delete();
        $poll->delete();
        return redirect()->route('poll.questions.view_suggested_questions');
    }
}
