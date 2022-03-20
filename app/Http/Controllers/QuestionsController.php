<?php

namespace App\Http\Controllers;

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
        if (preg_match('/\/polls\/(\d+)\/questions\/(\d*)\/(.*?$)/', $request->getRequestUri(),$arr_index_poll_and_question)){
            $poll = Poll::find($arr_index_poll_and_question[1]);
            $question = $poll->questions()->where('id', $arr_index_poll_and_question[2])->get();//ID question
            $error = rawurldecode($arr_index_poll_and_question[3]);
        }elseif (preg_match('/\/polls\/(\d+)\/questions\/(\d*)/', $request->getRequestUri(),$arr_index_poll_and_question)){
            $poll = Poll::find($arr_index_poll_and_question[1]);
            $question = $poll->questions()->where('id', $arr_index_poll_and_question[2])->get();//ID question
        }
        if (isset($question[0])) {
            $count = 0;
            foreach ($poll->questions()->get() as $question_poll) {
                $count++;
                if ($question_poll->id == $question[0]->id){
                    break;
                }
            }

            $files = [];
            foreach ($question[0]->question_files()->get() as $file){
                preg_match('/\..*$/', $file->path_to_file, $matches_type_of_file);
                $type_of_file = str_replace( ".", '', $matches_type_of_file[0]);
                $type = $this->switchTypeFile($type_of_file);

                array_push($files,[
                    'file_id' => $file->id,
                    'fileUpload' => [
                        0 =>[
                            'lastModified' => $file->updated_at,
                            'lastModifiedDate' => Storage::disk('public')->lastModified($file->path_to_file),
                            'name' => Storage::url($file->path_to_file),
                            'size' => Storage::disk('public')->size($file->path_to_file),
                            'type' => '',
                            'webkitRelativePath' => ''
                        ]
                    ],
                    'isValidText' => true,
                    'text' => $file->text_for_file,
                    'isValidFileSize' => true,
                    'isValidFileName' => true,
                    'hideDragAndDrop' => true,
                    'fileInputRef' => true,
                    'type' => $type,
                    'siFromStorage' => true,
                    'fileLoaded' => false
                ]);
            }
        }

        //{guid: 'guid', text: 'Answer', isValidText: false}
        $answers = [];
        if (isset($question[0])) {
            foreach ($question[0]->answers()->get() as $answer) {
                array_push($answers, [
                    'answer_id' => $answer->id,
                    'text' => $answer->text,
                    'isValidText' => true
                ]);
            }
        }
        if (!isset($count)){
            $count='';
        }

        \JavaScript::put([
            'poll' => $poll,
            'count_question' => $poll->questions()->count(),
            'current_num_question' => $count,
            'csrf_token' =>  csrf_token(),
            'question' => isset($question[0])
                ? $question[0]
                : '',
            'files' => isset($question[0])
                ? $files
                : '',
            'answer' => isset($question[0])
                ? $answers
                : '',
            'error' => $error
        ]);
        return view('questions.create');
    }

    public function switchTypeFile ($type_of_file){
        switch ( $type_of_file){
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
                return'other';

        }
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Poll $poll)
    {
        \JavaScript::put([
            'poll' => $poll,
            'count_question' => $poll->questions()->count(),
            'csrf_token' =>  csrf_token()
        ]);

        return view('questions.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }
    /**
     * add a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function add(Request $request)
    {
        //
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Question $question)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function destroy(Poll $poll, Question $question)
    {
        foreach($question->question_files()->get() as $file){
            Storage::disk('public')->delete($file->path_to_file);
        }
        $question->delete();
        return redirect()->route('poll.edit', [
            'poll' => $poll
        ]);
    }
}
