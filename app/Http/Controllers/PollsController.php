<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Item;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

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
    public function report(Poll $poll)
    {
        $out = [];

       // $peopleThatDidNotVote = $poll->peopleThatDidNotVote();

  /*      $grandParents = Item::where('parent_id', null)->get()->each(function ($grandParent) use (&$out, $peopleThatDidNotVote) {
            dump($grandParent->toArray());


            $notVoted = $grandParent->getPeopleThatDidNotVote($peopleThatDidNotVote);
            dd($notVoted);

            if ($notVoted->isEmpty()) {
                return $out;
            }

            $out = new Collection();

            $item = $grandParent;

            $directChildren = $item->getDirectChildren();

            while ($directChildren->isNotEmpty()) {
                $out[$item->id] = $directChildren;
            }


            $out[$grandParent->id] = new Collection();
        });
*/
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
        arsort($hierarchy_str);
        return view('polls.report', [
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
            return redirect()->route('poll.display',[$poll->id])
                ->withErrors("Участник с таким пином и телефоном не найден");

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
                return redirect()->route('poll.display',[$poll->id])
                    ->withErrors("Вы уже проголосовали по данному вопросу!");
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
