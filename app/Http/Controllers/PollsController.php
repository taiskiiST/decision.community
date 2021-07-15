<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Item;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Vote;
use Illuminate\Http\Request;

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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
     * Display the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function show(Poll $poll)
    {
        return view('polls.show', [
            'poll' => $poll
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
            'poll' => $poll
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
        return view('polls.report', [
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
        $rules = [
            'pin' => 'required',
            'phone' => 'required',
        ];

        foreach ($poll->questions as $question) {
            $rules["question_{$question->id}"] = 'required|exists:answers,id';
        }

        $parameters = $this->validate($request, $rules);

        $item = Item::where('pin', $request['pin'])->where('phone', $request['phone'])->first();
        if (! $item) {
            return "Участник с таким пином и телефоном не найден";
        }

        foreach ($poll->questions as $question) {

            if (! Vote::where('question_id','=',$question->id)
                ->where('item_id','=',$item->id)->count() ) {

                $answerId = $parameters["question_{$question->id}"];

                $answer = Answer::find($answerId);

                if (!$answer) {
                    continue;
                }

                $item->vote($question, $answer);
            }else{
                return "Вы уже проголосовали по данному вопросу!";
            }
        }

        /*$questions = $poll->questions();
        foreach ($questions as $question){
            dd($question);
        }*/

        return view('polls.answer', [
            'poll' => $poll,

        ]);
        //return 'Спасибо!';
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
    public function update(Request $request, Poll $poll)
    {
        //
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
