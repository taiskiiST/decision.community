<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Item;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PollsController extends Controller
{
    /**
     * ItemsController constructor.
     */
    public function __construct()
    {
        $this->authorizeResource(Poll::class, 'poll');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('polls.index', [
            'polls' => Poll::all()
        ]);
    }


    public function create()
    {
        return view('polls.create');
    }


    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        $poll = Poll::find($request['del_poll']);
        $poll->delete();
        return redirect()->route('polls.index', [
            'polls' => Poll::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules["poll-name"] = 'required';
        $parameters = $this->validate($request, $rules);

        $poll = Poll::create([
            'name' => $parameters['poll-name']
        ]);

        \JavaScript::put([
            'foo' => 'bar'
        ]);

        return redirect()->route('poll.questions.create',['poll' => $poll->id]);
    }

    public function addQuestion(Request $request, Poll $poll){
        $inputs = $request->input();
        foreach ($inputs as $key => $input){
            if (strpos($key, 'question_text_') === false) {
            } else {
                $question_text_id = preg_replace('/question_text_/','',$key);
                $rules["question_text_".$question_text_id] = 'required';
            }
            if (strpos($key, 'text_for_') === false) {
            } else {

                $rules[$key] = 'required';
                $file_id = preg_replace('/file_text_for_/','',$key);
                if ($request->hasFile($file_id) && $request->file($file_id)->isValid()) {
                    $rules[$file_id] = 'file';
                }
            }
            if (strpos($key, 'text_answer_') === false) {
            } else {
                $rules[$key] = 'required';
            }
        }
        $parameters = $this->validate($request, $rules);
        $flag = false;
        $indexes_of_files = [];
        $indexes_of_answers = [];
        foreach ($parameters as $key => $value){
            if (strpos($key, 'question_text_') === false) {
            } else {
                $question_text_id = preg_replace('/question_text_/','',$key);
                $question = $poll->questions()->updateOrInsert(
                    ['id' => $question_text_id, 'poll_id' => $poll->id],
                    ['text' => $value]
                );
                $question = Question::find($question_text_id);
            }
            if (strpos($key, 'text_for_') === false) {
            } else {
                $flag = true;
                $file_id = preg_replace('/file_text_for_/','',$key);
                foreach ($question->question_files()->get() as $file){
                    if ($file->id == $file_id){
                        $data_questions = $file->update([
                            'text_for_file' => $value,
                        ]);
                        array_push($indexes_of_files, $file->id );
                    }
                }

                if($request->hasFile($file_id) && $request->file($file_id)->isValid()) {
                    if($question->question_files()->where('id',$file_id)->count() > 0 ) {
                        $question_new = $question->question_files()->updateOrInsert(
                            ['id' => $file_id, 'question_id' => $question->id],
                        [
                            'text_for_file' => $value,
                            'path_to_file' => $request->file($file_id)->store('storage/' . $poll->id . '/' . $question_text_id, 'public')
                        ])->get();
                    }else{
                        $question_new = $question->question_files()->create(
                            [
                                'text_for_file' => $value,
                                'path_to_file' => $request->file($file_id)->store('storage/' . $poll->id . '/' . $question_text_id, 'public')
                            ]);
                    }
                    if(isset($question_new[0])) {
                        array_push($indexes_of_files, $question_new[0]->id);
                    }else{
                        array_push($indexes_of_files, $question_new->id);
                    }
                }
                if($request->file($file_id)) {
                    if (!$request->file($file_id)->isValid()) {
                        $str = 'Файл ' . $request->file($file_id)->getClientOriginalName() . ' поврежден!';
                        return redirect()->route('poll.questions.index', ['poll' => $poll->id, 'id_question' => $question_text_id, 'error' => $str]);
                    }
                }
            }
            if (strpos($key, 'text_answer_') === false) {
            } else {
                $answer_id = preg_replace('/text_answer_/','',$key);
                if($question->answers()->where('id',$answer_id)->count() > 0 ) {
                    $answer_update = $question->answers()->updateOrInsert(
                        ['id' => $answer_id, 'question_id' => $question->id],
                        ['text' => $value]
                    )->get();
                    array_push($indexes_of_answers, $answer_update[0]->id);
                }else{
                    $answer_new = $question->answers()->create(
                        ['text' => $value]
                    );
                    array_push($indexes_of_answers, $answer_new->id);
                }

            }

        }
        if(!$flag &&  $question->question_files()->count() > 0){
            foreach ($question->question_files()->get() as $file){
                Storage::disk('public')->delete($file->path_to_file);
                $file->delete();
            }
        }else {
            foreach ($question->question_files()->get() as $file) {
                if (!in_array($file->id, $indexes_of_files)) {
                    Storage::disk('public')->delete($file->path_to_file);
                    $file->delete();
                }
            }
        }
        foreach ($question->answers()->get() as $answer) {
            if (!in_array($answer->id, $indexes_of_answers)) {
                $answer->delete();
            }
        }
        return redirect()->route('poll.update', [
            'poll' => $poll
        ]);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */

    //// polls/7
    public function show(Poll $poll)
    {
        return view('polls.display', [
            'poll' => $poll,
            'displayMode' => true
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function display(Poll $poll)
    {
        return view('polls.display', [
            'poll' => $poll,
            'displayMode' => false
        ]);
    }

    function recurs ($parent_id, $items_id){
        $sons_id = DB::select("SELECT id FROM items where parent_id = ? AND id NOT IN (?)", [$parent_id, $items_id]);
        foreach ($sons_id as $son_id)
            if ($son_id) {
                recurs($son_id, $items_id);
            }else{
                return ;
            }
    }

    protected function fillTree(Item $item, array &$out)
    {
        $directChildren = $item->getDirectChildren();

        if ($directChildren->isNotEmpty()) {
            foreach ($directChildren as $child) {
                $this->fillTree($child, $out);
            }
        } else {
            $out[$item->id][] = $item;
        }

        return $out;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function report_voted(Poll $poll)
    {
        $out = [];

        $poll->peopleThatVote()->groupBy('parent_id')->each(function ($group, $groupId) use (&$out) {
            $parent = Item::find($groupId);

            $hierarchy = $parent->getTopHierarchy();

            $out[$groupId] = [
                'group' => $group,
                'hierarchy' => $hierarchy
            ];
        });
        //dd($out);
        $str = '';
        $str1 = '';
        $str2 = '';
        $sting = '';
        $index = 0;
        foreach ($out as $group) {
            foreach ($group as $key => $items) {
                if ($key == 'hierarchy') {
                    $str .= '<table style=\"border: 1px solid grey;\"><tr>';
                    foreach ($items as $hierarchy) {
                        $str1 = "<th style=\"border: 1px solid grey;\">".$hierarchy['item']->name."</th>".$str1;
                    }
                    $str .= $str1."<th style=\"border: 1px solid grey;\">Первичная ячейка</th></tr>";
                    $str .= '<tr>';
                    foreach ($items as $hierarchy) {
                        $chairman_name = $hierarchy['chairman']?$hierarchy['chairman']->name:'';
                        $chairman_phone = $hierarchy['chairman']?$hierarchy['chairman']->phone:'';
                        $str2 = "<td style=\"border: 1px solid grey;\">".$chairman_name." <br /> ".$chairman_phone."</td>".$str2;
                    }
                    $str .= $str2;
                    $string = $str;
                    $str = '';
                    $str1 = '';
                    $str2 = '';
                }
            }
            $hierarchy_str[$index] = $string;
            $index++;
            $string = '';
        }
        $index = 0;
        foreach ($out as $group) {
            foreach ($group as $key => $items) {
                if ($key == 'group') {
                    $hierarchy_str[$index] .= "<td style=\"border: 1px solid grey;\">";
                    foreach ($items as $item) {
                        $hierarchy_str[$index] .= $item->name.' - '.$item->phone."<br />";
                    }
                    $hierarchy_str[$index] .= "</td></tr></table>";
                    $index++;
                }
            }
        }
        if ( isset($hierarchy_str) ) {
            arsort($hierarchy_str);
        }else{
            $hierarchy_str = [];
        }
        return view('polls.report_voted', [
            'poll' => $poll,
            'out' => $out,
            'arr_strings' => $hierarchy_str
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function report(Poll $poll)
    {
        $out = [];

        $poll->peopleThatDidNotVote()->groupBy('parent_id')->each(function ($group, $groupId) use (&$out) {
            $parent = Item::find($groupId);

            $hierarchy = $parent->getTopHierarchy();

            $out[$groupId] = [
                'group' => $group,
                'hierarchy' => $hierarchy
            ];
        });
        $str = '';
        $str1 = '';
        $str2 = '';
        $index = 0;
        foreach ($out as $group) {
            foreach ($group as $key => $items) {
                if ($key == 'hierarchy') {
                    $str .= '<table style=\"border: 1px solid grey;\"><tr>';
                    foreach ($items as $hierarchy) {
                        $str1 = "<th style=\"border: 1px solid grey;\">".$hierarchy['item']->name."</th>".$str1;
                    }
                    $str .= $str1."<th style=\"border: 1px solid grey;\">Первичная ячейка</th></tr>";
                    $str .= '<tr>';
                    foreach ($items as $hierarchy) {
                        $chairman_name = $hierarchy['chairman']?$hierarchy['chairman']->name:'';
                        $chairman_phone = $hierarchy['chairman']?$hierarchy['chairman']->phone:'';
                        $str2 = "<td style=\"border: 1px solid grey;\">".$chairman_name." <br /> ".$chairman_phone."</td>".$str2;
                    }
                    $str .= $str2;
                    $string = $str;
                    $str = '';
                    $str1 = '';
                    $str2 = '';
                }
            }
            $hierarchy_str[$index] = $string;
            $index++;
            $string = '';
        }
        $index = 0;
        foreach ($out as $group) {
            foreach ($group as $key => $items) {
                if ($key == 'group') {
                    $hierarchy_str[$index] .= "<td style=\"border: 1px solid grey;\">";
                    foreach ($items as $item) {
                        $hierarchy_str[$index] .= $item->name.' - '.$item->phone."<br />";
                    }
                    $hierarchy_str[$index] .= "</td></tr></table>";
                    $index++;
                }
            }
        }
        arsort($hierarchy_str);
        return view('polls.report', [
            'poll' => $poll,
            'out' => $out,
            'arr_strings' => $hierarchy_str
        ]);
    }

    public function endVote(Poll $poll)
    {
        if(!$poll->finished) {
            $poll->update([
                'finished' => date('Y-m-d H:i:s'),
            ]);
        }else{
            $poll->update([
                'finished' => null,
            ]);
        }

        return redirect()->route('poll.update', [
            'poll' => $poll
        ]);

    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function results(Poll $poll)
    {
        return view('polls.results', [
            'poll' => $poll
        ]);
    }
    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function results_list(Poll $poll)
    {
        return view('polls.results_list', [
            'poll' => $poll,
            'itemsNameHash'   => Item::all()->pluck('name', 'id'),
            'itemsPhoneHash'   => Item::all()->pluck('phone', 'id'),
            'itemsAddressHash'   => Item::all()->pluck('address', 'id'),
            'itemsParentIdHash'   => Item::all()->pluck('parent_id', 'id')
        ]);
    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function submit(Request $request, Poll $poll)
    {
        $user = auth()->user();

        foreach ($poll->questions as $question) {
            $rules["question_{$question->id}"] = 'required|exists:answers,id';
        }
        $parameters = $this->validate($request, $rules);

        foreach ($poll->questions as $question) {
            if (! Vote::where('question_id','=',$question->id)
                ->where('user_id','=',$user->id)->count() ) {
                $answerId = $parameters["question_{$question->id}"];
                $answer = Answer::find($answerId);
                if (!$answer) {
                    continue;
                }
                $user->vote($question, $answer);
            }else{
                return redirect()->route('poll.display',[$poll->id])
                    ->withErrors("Вы уже проголосовали по данному вопросу!");
            }
        }

        return view('polls.answer', [
            'poll' => $poll,

        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function edit(Poll $poll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function update(Poll $poll)
    {
        return view('polls.update', [
            'poll' => $poll,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function destroy(Poll $poll)
    {
        //
    }
}
