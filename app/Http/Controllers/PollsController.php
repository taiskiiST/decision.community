<?php

namespace App\Http\Controllers;

use App\Models\AnonymousUser;
use App\Models\AnonymousVote;
use App\Models\Answer;
use App\Models\Item;
use App\Models\Organizer;
use App\Models\Permission;
use App\Models\Poll;
use App\Models\Question;
use App\Models\Quorum;
use App\Models\Speaker;
use App\Models\TypeOfPoll;
use App\Models\User;
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
            'polls' => Poll::all(),
            'users' => User::all()
        ]);
    }


    public function create(Request $request)
    {
        switch ($request->type_of_poll ){
            case TypeOfPoll::PUBLIC_MEETING_TSN: {
                $type_of_poll = TypeOfPoll::select('id')->where('type_of_poll','=',TypeOfPoll::PUBLIC_MEETING_TSN)->get();
                break;
            }
            case TypeOfPoll::GOVERNANCE_MEETING_TSN: {
                $type_of_poll = TypeOfPoll::select('id')->where('type_of_poll','=',TypeOfPoll::GOVERNANCE_MEETING_TSN)->get();
                break;
            }
            case TypeOfPoll::VOTE_FOR_TSN: {
                $type_of_poll = TypeOfPoll::select('id')->where('type_of_poll','=',TypeOfPoll::VOTE_FOR_TSN)->get();
                break;
            }
            case TypeOfPoll::PUBLIC_VOTE: {
                $type_of_poll = TypeOfPoll::select('id')->where('type_of_poll','=',TypeOfPoll::PUBLIC_VOTE)->get();
                break;
            }
        }
        return view('polls.create',['type_of_poll' => $type_of_poll[0]->id]);
    }

    public function delProtocol(Request $request){
        if (preg_match('/\/polls\/(\d+)\/delProtocol/', $request->getRequestUri(),$arr_index_poll_and_question)){
            $poll = Poll::find($arr_index_poll_and_question[1]);
            Storage::disk('public')->delete($poll->protocol);
            $poll->update([
                'protocol' => null
            ]);
            return redirect()->route('poll.edit', [
                'poll' => $poll
            ]);
        }
    }

    public function generateBlank(Poll $poll, Request $request){
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor(base_path('storage/app/public/storage/TemplateBlank.docx'));

        $templateProcessor->setValue('name', $poll->name);
//**************************************************************
        $count_blank = 1;
        $replacements_blank = [];
        foreach ($poll->questions()->get() as $question){
            $new_array = array(
                'count_question_blank' => $count_blank,
                'question_text_blank' => $question->text
            );
            ++$count_blank;
            array_push($replacements_blank, $new_array);
        }
        $templateProcessor->cloneBlock('block_blank', 0, true, false, $replacements_blank);

        foreach ($poll->questions()->get() as $question){
            $replacements_answer_blank = [];
            $count_answer_blank = 1;
            foreach($question->answers()->get() as $answer){
                $new_array_answer = array(
                    'count_answer_blank' => $count_answer_blank,
                    'answer_text_blank' => $answer->text
                );
                ++$count_answer_blank;
                array_push($replacements_answer_blank, $new_array_answer);
            }
            $templateProcessor->cloneRowAndSetValues('count_answer_blank', $replacements_answer_blank);
        }
//**************************************************************
        if(!file_exists(base_path('storage/app/public/storage/'.$poll->id))){
            mkdir(base_path('storage/app/public/storage/'.$poll->id));
        }

        $str_path = 'storage/app/public/storage/'.$poll->id.'/Blank.docx';
        $templateProcessor->saveAs(base_path($str_path));
        $poll->update([
            'blank_doc' =>  '/storage/storage/'.$poll->id.'/Blank.docx'
        ]);

        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    public function generateProtocol(Poll $poll, Request $request){
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor(base_path('storage/app/public/storage/TemplateProtocol.docx'));
        $num_protocol = Poll::all()->count();
        if(Quorum::where('poll_id',$poll->id)->get()->isNotEmpty()){
            $qourum = Quorum::where('poll_id',$poll->id)->get()[0];
        }else{
            return redirect()->route('poll.results', [
                'poll' => $poll,
            ])->withErrors("Кворум пуст!");;
        }
        if(Organizer::where('poll_id',$poll->id)->get()->isNotEmpty()){
            $organizers = Organizer::where('poll_id',$poll->id)->get()[0];
        }else{
            return redirect()->route('poll.results', [
                'poll' => $poll,
            ])->withErrors("Не назначены организаторы мероприятия!");;
        }

        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(false);
        if(round($qourum->all_users_that_can_vote/2,0,PHP_ROUND_HALF_UP) > $qourum->count_of_voting_current ){
            $form_protocol = 'заочная';
            $is_forum = 'не имеется';
            $yes_no = 'не';
        }else{
            $form_protocol = 'очная';
            $is_forum = 'имеется';
            $yes_no = '';
        }
        $count = 1;
        $replacements_agenda = [];
        foreach ($poll->questions()->get() as $question){
            $new_array_agenda = array(
                'count_agenda' => $count,
                'agenda_text' => $question->text
            );
            ++$count;
            array_push($replacements_agenda, $new_array_agenda);
        }
        $templateProcessor->cloneBlock('block_agenda', 0, true, false, $replacements_agenda);

//**************************************************************
        $count = 1;
        $replacements = [];
        foreach ($poll->questions()->get() as $question){

            $new_array = array(
                'count_question' => $count,
                'question_text' => $question->text,
                'qourum_count_of_voting_current' => $qourum->count_of_voting_current,
            );

            ++$count;
            array_push($replacements, $new_array);
        }
        $templateProcessor->cloneBlock('block_question', 0, true, false, $replacements);


        foreach ($poll->questions()->get() as $question) {
            $replacements_answer = [];
            $count_answer = 1;
            foreach ($question->answers()->get() as $answer) {
                $new_array_answer = array(
                    'num_answer' => $count_answer,
                    'answer_text' => $answer->text,
                    'answer_countVotes' => $answer->countVotes($answer->id),
                    'answer_percentOfQuestions' => $answer->percentOfQuestions($question->id, $answer->id)
                );
                ++$count_answer;
                array_push($replacements_answer, $new_array_answer);
            }
            $templateProcessor->cloneRowAndSetValues('num_answer', $replacements_answer);
        }
//**************************************************************


//**************************************************************
        $users_all = User::all();
        $count = 1;
        $replacements_users = [];
        foreach ($users_all as $user){
            if(in_array($user->id, explode(',', $qourum->list_of_all_current_users))){
                $new_array = array( 'num_users'=> $count , 'user_name' => $user->name );
                ++$count;
                array_push($replacements_users, $new_array);
            }
        }
        $templateProcessor->cloneRowAndSetValues('num_users', $replacements_users);
//**************************************************************


        $dt_start = new \DateTime();
        $dt_start->setTimestamp(strtotime($poll->start));

        $invited = explode(',', $organizers->users_invited_id);
        $srt_name_invited = '';
        foreach ($invited as $key => $invite){
            $srt_name_invited .= User::find($invite)->name.', ';
        }
        $srt_name_invited = substr($srt_name_invited,0,-2);


        foreach ($poll->questions()->get() as $question) {
            foreach ($question->speakers()->get() as $speaker) {
                $speakers = explode(',', $speaker->users_speaker_id);
                $srt_name_speakers = '';
                foreach ($speakers as $key => $speaker_id){
                    $srt_name_speakers .= User::find($speaker_id)->name.', ';
                }
            }
        }
        $srt_name_speakers = substr($srt_name_invited,0,-2);


        $templateProcessor->setValue('num_protocol', $num_protocol);
        $templateProcessor->setValue('name', $poll->name);
        $templateProcessor->setValue('invited', $srt_name_invited);
        $templateProcessor->setValue('speakers', $srt_name_speakers);
        $templateProcessor->setValue('date', date_format($dt_start,"d.m.Y") );
        $templateProcessor->setValue('form', $form_protocol);
        //$templateProcessor->setValue('agenda', htmlspecialchars($text_agenda));
        $templateProcessor->setValue('all_users', $qourum->all_users_that_can_vote);
        $templateProcessor->setValue('current_sum_users', $qourum->count_of_voting_current);
        $templateProcessor->setValue('is_quorum', $is_forum);
        $templateProcessor->setValue('yes_no', $yes_no);
        $templateProcessor->setValue('chairman', User::find($organizers->user_chairman_id)->name );
        $templateProcessor->setValue('secretary', User::find($organizers->user_secretary_id)->name );
        $templateProcessor->setValue('counter_vote', User::find($organizers->user_counter_votes_id)->name );
        $templateProcessor->setValue('current_sum_users_yes', $qourum->count_of_voting_current );
        $templateProcessor->setValue('current_sum_users_no', 0 );
        $templateProcessor->setValue('current_sum_users_nothing', 0 );
        $templateProcessor->setValue('start', date_format($dt_start,"d.m.Y, H:i:s") );
        //$templateProcessor->setValue('text_question_answer', htmlspecialchars($text_question_answer));

        $dt_end = new \DateTime();
        $dt_end->setTimestamp(strtotime($poll->finished));

        $templateProcessor->setValue('close', date_format($dt_end,"d.m.Y, H:i:s"));
        if(!file_exists(base_path('storage/app/public/storage/'.$poll->id))){
            mkdir(base_path('storage/app/public/storage/'.$poll->id));
        }

        $str_path = 'storage/app/public/storage/'.$poll->id.'/Protocol.docx';
        $templateProcessor->saveAs(base_path($str_path));
        $poll->update([
            'protocol_doc' =>  '/storage/storage/'.$poll->id.'/Protocol.docx'
        ]);

        return redirect()->route('poll.results', [
            'poll' => $poll,
        ]);
    }

    public function addProtocol(Request $request, $poll_id){
        $poll = Poll::find($poll_id);
        $error = '';
        if ($request->hasFile(key($request->file())) && $request->file(key($request->file()))->isValid()) {
            $rules[key($request->file())] = 'file';
        }else{
            if($request->file(key($request->file()))) {
                $error = 'Файл ' . $request->file(key($request->file()))->getClientOriginalName() . ' поврежден!';
                return redirect()->route('poll.edit', [
                    'poll' => $poll->id,
                    'error' => $error
                ]);
            }else{
                \JavaScript::put([
                    'poll' => $poll,
                    'csrf_token' =>  csrf_token(),
                    'file_protocol' => '',
                    'error' => '',
                    'is_admin'=> auth()->user()->isAdmin()
                ]);

                return redirect()->route('poll.edit', [
                    'poll' => $poll,
                    'error' => ''
                ]);
            }
        }

        $parameters = $this->validate($request, $rules);

        $path_to_protocol = $poll->update([
            'protocol' => $request->file(key($request->file()))->store('storage/' . $poll->id , 'public')
        ]);


        \JavaScript::put([
            'poll' => $poll,
            'csrf_token' =>  csrf_token(),
            'file_protocol' => $poll->protocol,
            'error' => $error
        ]);

        return redirect()->route('poll.edit', [
            'poll' => $poll,
            'error' => $error
        ]);
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
        $rules["type_of_poll"] = 'required';
        $rules["poll-name"] = 'required';
        $parameters = $this->validate($request, $rules);


        $poll = Poll::create([
            'name' => $parameters['poll-name'],
            'type_of_poll' => $parameters['type_of_poll']
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
        $is_update_file = false;
        $indexes_of_files = [];
        $indexes_of_answers = [];
        foreach ($parameters as $key => $value){
            if (strpos($key, 'question_text_') === false) {
            } else {
                $question_text_id = preg_replace('/question_text_/','',$key);
                if($question_text_id == '0'){
                    $question = $poll->questions()->create([
                        'poll_id' => $poll->id,
                        'text' => $value
                    ]);
                    $question_text_id = $question->id;
                }else {
                    $question = $poll->questions()->updateOrInsert(
                        ['id' => $question_text_id, 'poll_id' => $poll->id],
                        ['text' => $value]
                    );
                    $question = Question::find($question_text_id);
                }
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
                        Storage::disk('public')->delete($file->path_to_file);
                        $file_new = $question->question_files()->updateOrInsert(
                            ['id' => $file_id, 'question_id' => $question->id],
                        [
                            'text_for_file' => $value,
                            'path_to_file' => $request->file($file_id)->store('storage/' . $poll->id . '/' . $question_text_id, 'public')
                        ])->get();
                        $is_update_file = true;
                    }else{
                        $file_new = $question->question_files()->create(
                            [
                                'text_for_file' => $value,
                                'path_to_file' => $request->file($file_id)->store('storage/' . $poll->id . '/' . $question_text_id, 'public')
                            ]);
                    }
                    if(!$is_update_file) {
                        if (isset($file_new[0])) {
                            array_push($indexes_of_files, $file_new[0]->id);
                        } else {
                            array_push($indexes_of_files, $file_new->id);
                        }
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
        //dd($indexes_of_files);
        if(!$flag &&  $question->question_files()->count() > 0){
            foreach ($question->question_files()->get() as $file){
                Storage::disk('public')->delete($file->path_to_file);
                $file->delete();
            }
        }else {
            foreach ($question->question_files()->get() as $file) {
                //dd($file->id);
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
        return redirect()->route('poll.edit', [
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
            'displayMode' => true,
            'quorum' => '',
            'users' => User::all()
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
        $this->updateQuorumInfo($poll);
        $quorum = Quorum::where('poll_id', $poll->id)->count() > 0 ? Quorum::where('poll_id', $poll->id)->get()[0]:'';
        return view('polls.display', [
            'poll' => $poll,
            'quorum' => $quorum,
            'displayMode' => false,
            'users' => User::all()
        ]);
    }

    public function start(Poll $poll)
    {
        if($poll->id) {
            $poll->update([
                'start' => date('Y-m-d H:i:s'),
            ]);
        }
        return redirect()->route('poll.requisites', [
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

        return redirect()->route('poll.edit', [
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
        $anonymous = false;
        $user = auth()->user();

        if($request->private_poll){
            $user = AnonymousUser::create();
            $anonymous = true;
        }

        foreach ($poll->questions as $question) {
            $rules["question_{$question->id}"] = 'required|exists:answers,id';
            if(!empty($request->input('speakers'.$question->id))){
                $list = implode(',',$request->input('speakers'.$question->id));
                Speaker::updateOrCreate([
                    'question_id' => $question->id,
                ],
                    [
                        'users_speaker_id' => $list
                    ]
                );
            }
        }
        $parameters = $this->validate($request, $rules);
        if(!$anonymous && !$poll->isPublicVote()) {
            foreach ($poll->questions as $question) {
                if (!Vote::where('question_id', '=', $question->id)
                    ->where('user_id', '=', $user->id)->count()) {
                    $answerId = $parameters["question_{$question->id}"];
                    $answer = Answer::find($answerId);
                    if (!$answer) {
                        continue;
                    }
                    $user->vote($question, $answer);
                } else {
                    return redirect()->route('poll.display', [$poll->id])
                        ->withErrors("Вы уже проголосовали по данному вопросу!");
                }
            }
            return view('polls.results', [
                'poll' => $poll,

            ]);
        }else{
            if($anonymous) {
                foreach ($poll->questions as $question) {
                    $answerId = $parameters["question_{$question->id}"];
                    $answer = Answer::find($answerId);
                    if (!$answer) {
                        continue;
                    }
                    $user->vote($question, $answer);
                    auth()->user()->vote($question, $answer);
                }
            }else{
                foreach ($poll->questions as $question) {
                    if (!Vote::where('question_id', '=', $question->id)
                        ->where('user_id', '=', $user->id)->count()) {
                        $answerId = $parameters["question_{$question->id}"];
                        $answer = Answer::find($answerId);
                        if (!$answer) {
                            continue;
                        }
                        $user->vote($question, $answer);
                        $user_anonymous = AnonymousUser::create();
                        $user_anonymous->vote($question, $answer);
                    } else {
                        return redirect()->route('poll.display', [$poll->id])
                            ->withErrors("Вы уже проголосовали по данному вопросу!");
                    }
                }
            }
            return redirect()->route('poll.results.public', [
                'poll' => $poll,

            ]);
        }


    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Poll  $poll
     * @return \Illuminate\Http\Response
     */
    public function edit(Poll $poll, $error = '')
    {
        \JavaScript::put([
            'poll' => $poll->id,
            'csrf_token' =>  csrf_token(),
            'file_protocol' => $poll->protocol ? $poll->protocol : '',
            'error' => $error
        ]);

        return view('polls.update', [
            'poll' => $poll,
        ]);
    }

    public function agenda(Poll $poll)
    {
        \JavaScript::put([
            'poll' => $poll->id,
            'csrf_token' =>  csrf_token(),
            'file_protocol' => $poll->protocol ? $poll->protocol : '',
        ]);

        return view('polls.update', [
            'poll' => $poll,
        ]);
    }

    public function requisites(Poll $poll)
    {
        //dd(Organizer::all());
        return view('polls.requisites', [
            'poll' => $poll,
            'error' => '',
            'users' => User::all(),
            'organizers' => Organizer::where('poll_id', $poll->id)->count()>0 ? Organizer::where('poll_id', $poll->id)->get()[0]:'',
            'quorum' => Quorum::where('poll_id', $poll->id)->count() > 0 ? Quorum::where('poll_id', $poll->id)->get()[0]:''
        ]);
    }

    public function requisitesSubmitName(Poll $poll, Request $request)
    {
        if($poll->id && isset($request->poll_name)) {
            $poll->update([
                'name' => $request->poll_name,
            ]);
        }

        return redirect()->route('poll.requisites', [
            'poll' => $poll
        ]);
    }

    public function updateQuorumInfo(Poll $poll)
    {
        $current_user_id = auth()->user()->id;
        if ($this->inQuorum($current_user_id, $poll->id) ){
            return;
        }else{
            $this->addToQuorum($current_user_id, $poll->id);
        }

    }
    public function inQuorum($user_id, $poll_id): bool
    {
        if( empty(Quorum::where('poll_id', $poll_id)->first()) ){
            Quorum::create([
                'poll_id' => $poll_id,
                'all_users_that_can_vote' => $this->countCanVote(),
                'list_of_all_current_users' => '',
                'count_of_voting_current' => 0
            ]);
            return false;
        }else {
            return in_array($user_id, explode(',', Quorum::where('poll_id', $poll_id)->first()->list_of_all_current_users));
        }
    }
    public function addToQuorum($user_id, $poll_id)
    {
        $quorum = Quorum::where('poll_id', $poll_id)->first();
        //dd($quorum->count_of_voting_current);
        if ($quorum->count_of_voting_current !== 0) {
            $list_of_all_current_users = explode(',', $quorum->list_of_all_current_users);
        }else{
            $list_of_all_current_users = [];
        }
        array_push($list_of_all_current_users, $user_id);
        $list_of_all_current_users = implode(',', $list_of_all_current_users);

        $count_of_voting_current = ++$quorum->count_of_voting_current;

        $quorum->update([
            'list_of_all_current_users' => $list_of_all_current_users,
            'count_of_voting_current' => $count_of_voting_current
        ]);
    }
    public function countCanVote()
    {
        $count = 0;
        $users = User::all();
        foreach ($users as $user){
            if( in_array(Permission::VOTE, explode(',', $user->permissions )) ){
                ++$count;
            }
        }
        return $count;
    }
    public function requisitesSubmitOrganizers(Poll $poll, Request $request)
    {
        $error = '';

        if($poll->id) {
            if( ($request->chairman !== $request->secretary) && ($request->chairman !== $request->counter_votes) && ($request->secretary !== $request->counter_votes)) {
                Organizer::updateOrCreate([
                    'poll_id' => $poll->id,
                ],
                    [
                        'user_chairman_id' => $request->chairman,
                        'user_secretary_id' => $request->secretary,
                        'user_counter_votes_id' => $request->counter_votes,
                    ]
                );
            }else{
                $error = 'Один и тот же человек не может занимать больше одной должности!';
            }
        }
        return redirect()->route('poll.requisites', [
            'poll'  => $poll,
        ])->withErrors($error);
    }

    public function requisitesSubmitInvited(Poll $poll, Request $request)
    {
        $error = '';
        $users_invited_is = implode(',' , $request->invited);
        Organizer::updateOrCreate([
            'poll_id' => $poll->id,
        ],
            [
                'users_invited_id' => $users_invited_is,
            ]
        );
        return redirect()->route('poll.requisites', [
            'poll'  => $poll,
        ])->withErrors($error);
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
