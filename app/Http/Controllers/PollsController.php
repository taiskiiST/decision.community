<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Company;
use App\Models\Item;
use App\Models\Organizer;
use App\Models\Permission;
use App\Models\Poll;
use App\Models\Position;
use App\Models\Question;
use App\Models\TypeOfPoll;
use App\Models\TypeOfRight;
use App\Models\User;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Ramsey\Uuid\Type\Integer;

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
        $company = Company::current();

        if (!$company) {
            Auth::logout();

            return redirect('home');
        }

        return view('polls.index', [
            'polls'     => $company->polls,
            'users'     => $company->users->pluck('name', 'id'),
            'siteTitle' => $company->title,
        ]);
    }

    public function create(Request $request)
    {
        $typeOfPoll = TypeOfPoll::find($request->type_of_poll);

        return view('polls.create', ['type_of_poll' => $typeOfPoll->id]);
    }

    public function delProtocol(Request $request)
    {
        if (preg_match('/\/polls\/(\d+)\/delProtocol/', $request->getRequestUri(), $arr_index_poll_and_question)) {
            $poll = Poll::find($arr_index_poll_and_question[1]);
            Storage::disk('public')->delete($poll->protocol);
            $poll->update([
                'protocol' => null,
            ]);
            return redirect()->route('poll.edit', [
                'poll' => $poll,
            ]);
        }
    }

    public function delTags($html)
    {
        $search = ['<i>', '</i>', '<p>', '</p>', '<b>', '</b>'];
        $html = str_replace($search, "", $html);
        $search = '/<iframe.*?><\/iframe>/';
        $html = preg_replace($search, "", $html);
        $search = '/<a.*?<\/a>/';
        $html = preg_replace($search, "", $html);

        $search = '/{/';
        preg_match($search, $html, $matches, PREG_OFFSET_CAPTURE);
        if ($matches && $matches[0][1] == 0){
            $new_arr = json_decode($html, true);
            $html = $new_arr['blocks']['0']['text'];
        }

        return $html;
    }

    public function generateBlankWithOutTemplate(Poll $poll, Request $request)
    {
        $phpWord = new  \PhpOffice\PhpWord\PhpWord();
        $phpWord->setDefaultFontName('Times New Roman');
        $phpWord->setDefaultFontSize(14);
        $properties = $phpWord->getDocInfo();

        $properties->setCreator('Serg');
        $properties->setCompany($_ENV['APP_NAME']);
        $properties->setTitle('Бланк голосования');
        $properties->setDescription('Бланк голосования');
        $properties->setCategory('Голосования');
        $properties->setLastModifiedBy('Serg');
        $properties->setCreated(mktime(0, 0, 0, 4, 17, 2022));
        $properties->setModified(mktime(0, 0, 0, 4, 17, 202));
        $properties->setSubject('Голосование');
        $properties->setKeywords('голсование');

        $sectionStyle = [
            'orientation'        => 'portrait',
            'marginTop'          => \PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50),
            'marginLeft'         => 600,
            'marginRight'        => 600,
            'colsNum'            => 1,
            'pageNumberingStart' => 1,
            'borderBottomSize'   => 100,
            'borderBottomColor'  => 'C0C0C0',
        ];
        $section = $phpWord->addSection($sectionStyle);

//        $text = "PHPWord is a library written in pure PHP that provides a set of classes to write to and read from different document file formats.";
//        $fontStyle = array('name'=>'Arial', 'size'=>36, 'color'=>'075776', 'bold'=>TRUE, 'italic'=>TRUE);
        $parStyle = ['spaceBefore' => 10];

        $section->addText("Бланк для голосования", ['size' => 25, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addText($_ENV['APP_NAME'], ['size' => 25, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addText(date("d.m.Y"), '', ['spaceBefore' => 10, 'align' => 'right']);
        $section->addText(htmlspecialchars($poll->name), '', $parStyle);
        $section->addText(PHP_EOL);
        $section->addText("********************************************************************", '', $parStyle);

        $count_blank = 1;

        //$parser = new \HTMLtoOpenXML\Parser();

        //$ooXml = $parser->fromHTML($html);
        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);
        foreach ($poll->questions()->get() as $question) {
            $html = "По " . $count_blank . " вопросу " . $question->text;
            $html = $this->delTags($html);
            $textlines = explode("<br />", $html);
            //dd($textlines);
            $textrun = $section->addTextRun();
            $textrun->addText(array_shift($textlines));
            foreach ($textlines as $line) {
                $textrun->addTextBreak();
                // maybe twice if you want to seperate the text
                // $textrun->addTextBreak(2);
                $textrun->addText($line);
            }
//            \PhpOffice\PhpWord\Shared\Html::addHtml($section, $this->addNamespaces(htmlspecialchars_decode($parser->fromHTML($html))) );
            //$section->addText($parser->fromHTML($html) );htmlspecialchars_decode
            //\PhpOffice\PhpWord\Shared\Html::addHtml($section, $this->addNamespaces($parser->fromHTML($html)) );
            ++$count_blank;
            $section->addText("Варианты ответов:");
            $count_answer_blank = 1;
            $wordTable = $section->addTable(['borderSize' => 6, 'borderColor' => '999999', 'align' => 'left']);
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('№', '', ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(500), ['valign' => 'center'])->addText('Варианты ответа');
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText('Отметка голоса');
            foreach ($question->answers()->get() as $answer) {
                $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
                $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_answer_blank, '', ['align' => 'center', 'spaceAfter' => 150]);
                $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(500), ['valign' => 'center'])->addText($answer->text, '', ['valign' => 'center']);
                $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150));
                ++$count_answer_blank;
            }
            $section->addText("********************************************************************", '', $parStyle);
        }
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');

        $str_path = 'storage/app/public/storage/' . $poll->id . '/BlankNew.docx';
        $objWriter->save(base_path($str_path));
        $poll->update([
            'blank_doc' => '/storage/storage/' . $poll->id . '/BlankNew.docx',
        ]);
        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    public function generateBlankWithAnswersWithOutTemplate(Poll $poll, Request $request)
    {
        $phpWord = new  \PhpOffice\PhpWord\PhpWord();
        $phpWord->setDefaultFontName('Times New Roman');
        $phpWord->setDefaultFontSize(14);
        $properties = $phpWord->getDocInfo();

        $properties->setCreator('Serg');
        $properties->setCompany($_ENV['APP_NAME']);
        $properties->setTitle('Бланк голосования');
        $properties->setDescription('Бланк голосования');
        $properties->setCategory('Голосования');
        $properties->setLastModifiedBy('Serg');
        $properties->setCreated(mktime(0, 0, 0, 4, 17, 2022));
        $properties->setModified(mktime(0, 0, 0, 4, 17, 2022));
        $properties->setSubject('Голосование');
        $properties->setKeywords('голосование');

        $sectionStyle = [
            'orientation'        => 'portrait',
            'marginTop'          => \PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50),
            'marginLeft'         => 600,
            'marginRight'        => 600,
            'colsNum'            => 1,
            'pageNumberingStart' => 1,
            'borderBottomSize'   => 100,
            'borderBottomColor'  => 'C0C0C0',
        ];
        $section = $phpWord->addSection($sectionStyle);
        $parStyle = ['spaceBefore' => 10];
        $section->addText("Бланк для голосования", ['size' => 25, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addText($_ENV['APP_NAME'], ['size' => 25, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addText(date("d.m.Y"), '', ['spaceBefore' => 10, 'align' => 'right']);
        foreach ($poll->peopleThatVote() as $user) {

            $section->addText(htmlspecialchars($poll->name), '', $parStyle);
            $section->addText("Бланк для голосования для члена " . $_ENV['APP_NAME'] . ": " . $user->name, '', $parStyle);
            $section->addText(PHP_EOL);
            $section->addText("********************************************************************", '', $parStyle);

            $count_answer_blank = 1;
            $section->addText("Ответы на вопросы голосования:");
            \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);
            $wordTable = $section->addTable(['borderSize' => 6, 'borderColor' => '999999', 'align' => 'left']);
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('№', '', ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(500), ['valign' => 'center'])->addText('Текст вопроса');
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText('Варинат ответ за который отдан голос');
            foreach ($poll->questions()->get() as $question) {
                $html = $question->text;
                $html = $this->delTags($html);
                $search = ['<br>', '</br>', '<br/>', '<br />'];
                $html = str_replace($search, "", $html);

                $pattern = '/\s/i';
                $replacement = ' ';
                $html = preg_replace($pattern, $replacement, $html);
                //dd($html);
                $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
                $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_answer_blank, '', ['align' => 'center', 'spaceAfter' => 150]);
                $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(500), ['valign' => 'center'])->addText($html, ['size' => 10], ['valign' => 'center']);
                $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText($question->answerThatUserVote($user), '', ['valign' => 'center']);
                ++$count_answer_blank;
            }
            $section->addText("********************************************************************", '', $parStyle);
            $section->addText(PHP_EOL);
            $section->addText("Подпись ___________________________" . $user->name, ['size' => 14, 'bold' => False], ['spaceBefore' => 10, 'align' => 'left']);
            $section->addPageBreak();
        }
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');

        if (!file_exists(base_path('storage/app/public/storage/' . $poll->id))) {
            mkdir(base_path('storage/app/public/storage/' . $poll->id));
        }

        $str_path = 'storage/app/public/storage/' . $poll->id . '/BlankNewWithAnswers.docx';
        $objWriter->save(base_path($str_path));

        $poll->update([
            'blank_with_answers_doc' => 'storage/' . $poll->id . '/BlankNewWithAnswers.docx',
        ]);
        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    public function generateProtocolWithOutTemplate(Poll $poll, Request $request)
    {
        $phpWord = new  \PhpOffice\PhpWord\PhpWord();
        $phpWord->setDefaultFontName('Times New Roman');
        $phpWord->setDefaultFontSize(14);
        $properties = $phpWord->getDocInfo();

        $properties->setCreator('Serg');
        $properties->setCompany($_ENV['APP_NAME']);
        $properties->setTitle('Протокол голосования');
        $properties->setDescription('Протокол голосования');
        $properties->setCategory('Голосования');
        $properties->setLastModifiedBy('Serg');
        $properties->setCreated(mktime(0, 0, 0, 4, 17, 2022));
        $properties->setModified(mktime(0, 0, 0, 4, 17, 202));
        $properties->setSubject('Голосование');
        $properties->setKeywords('голсование');

        $sectionStyle = [
            'orientation'        => 'portrait',
            'marginTop'          => \PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50),
            'marginLeft'         => 600,
            'marginRight'        => 600,
            'colsNum'            => 1,
            'pageNumberingStart' => 1,
            'borderBottomSize'   => 100,
            'borderBottomColor'  => 'C0C0C0',
        ];
        $section = $phpWord->addSection($sectionStyle);

        $footer = $section->createFooter();
        $footer->addPreserveText('{PAGE} / {NUMPAGES}', ['bold' => true], ['align' => 'right']);

//        $text = "PHPWord is a library written in pure PHP that provides a set of classes to write to and read from different document file formats.";
//        $fontStyle = array('name'=>'Arial', 'size'=>36, 'color'=>'075776', 'bold'=>TRUE, 'italic'=>TRUE);
        $parStyle = ['spaceBefore' => 10];

        $num_protocol = Poll::where('type_of_poll', $poll->type_of_poll)->count() + 1;


        if (Organizer::where('poll_id', $poll->id)->get()->isNotEmpty()) {
            $organizers = Organizer::where('poll_id', $poll->id)->get()[0];
        } else {
//            return redirect()->route('poll.results', [
//                'poll' => $poll,
//            ])->withErrors("Не назначены организаторы мероприятия!");
        }
        $name_type_of_poll = $poll->typeOfPoll()->get()->first()->type_of_poll;
        $section->addText("ПРОТОКОЛ ".mb_strtoupper($name_type_of_poll)." №" . $num_protocol, ['size' => 18, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addText($poll->name, ['size' => 18, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addText("От " . date("d.m.Y"), '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addText("х.Ленинаван", '', ['spaceBefore' => 10, 'align' => 'right']);
        $section->addText("Присутствовали: список прилагается", '', ['spaceBefore' => 10, 'align' => 'left']);

        $invited =  []; //explode(',', $organizers->users_invited_id);
        $srt_name_invited = '';
        foreach ($invited as $key => $invite) {
            if (!empty($invite)) {
                $srt_name_invited .= User::find($invite)->name . ', ';
            }
        }
        $srt_name_invited = substr($srt_name_invited, 0, -2);
        $section->addText("Из числа приглашенных: " . $srt_name_invited, '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addText("Администратор: Третьяков Сергей Владимирович", '', ['spaceBefore' => 10, 'align' => 'left']);

        //$count_all_voters = $poll->company->potentialVotersNumber();
        $count_all_voters = $poll->company->potentialWeightVotersNumber(TypeOfRight::UPON_OWNERSHIP);
//        if(round($count_all_voters/2,0,PHP_ROUND_HALF_UP) > $qourum->count_of_voting_current ){
        $form_protocol = 'заочной';
        $is_forum = 'не набран';
//        }else{
//            $form_protocol = 'очная';
//            $is_forum = 'имеется';
        //}
        if (round($count_all_voters / 2, 0, PHP_ROUND_HALF_UP) > $poll->weightPeopleThatVote(TypeOfRight::UPON_OWNERSHIP)) {
            $yes_no = 'не';
        } else {
            $yes_no = '';
        }

        $section->addText("Форма проведения ".$name_type_of_poll ." : " . $form_protocol, '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addTextBreak();
        $section->addText("ПОВЕСТКА ДНЯ:", ['size' => 18, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);

        $count = 1;
        foreach ($poll->questions()->get() as $question) {
            $html = $this->delTags($question->text);
            $textlines = explode("<br />", $html);
            $textrun = $section->addTextRun();
            $textrun->addText($count . ". " . array_shift($textlines), '', ['spaceBefore' => 10, 'align' => 'left']);
            foreach ($textlines as $line) {
                $textrun->addTextBreak();
                // maybe twice if you want to seperate the text
                // $textrun->addTextBreak(2);
                $textrun->addText($line, '', ['spaceBefore' => 10, 'align' => 'left']);
            }
            ++$count;
            //$section->addText($count.". ".$question->text, '',['spaceBefore'=>10, 'align'=>'left']);
        }
        $section->addText("********************************************************************", '', ['spaceBefore' => 10]);
        $section->addText("Слушали:", ['bold' => TRUE]);
        $section->addText("Для принятия решений по повестке собрания необходимо наличие кворума. На основании принятых ранее решений определены председательствующий, секретарь собрания, ответственного за подсчетом голосов и администратор.", '', ['spaceBefore' => 10]);
        $section->addText("Председатель собрания - ", '', ['spaceBefore' => 10]);
        $section->addText("Секретарь собрания – ", '', ['spaceBefore' => 10]);
        $section->addText("Ответственный за подсчет голосов – ", '', ['spaceBefore' => 10]);
        $section->addText("Администратор – ", '', ['spaceBefore' => 10]);
        $section->addText("Собрание будет проводиться в ".$form_protocol." форме.", '', ['spaceBefore' => 10]);
        $section->addTextBreak();

        $section->addText("В голосовании в заочной форме приняли участие " . $count_all_voters . " проголосовало " . $poll->weightPeopleThatVote(TypeOfRight::UPON_OWNERSHIP)." кворум ".$yes_no." набран! Собрание ".$yes_no." легитимно и ".$yes_no." правомочно принимать решения по вопросам повестки дня.", '', ['spaceBefore' => 10]);
        $section->addTextBreak();

//        $section->addText("Председателем собрания - " . User::find($organizers->user_chairman_id)->name, '', ['spaceBefore' => 10, 'align' => 'left']);
//        $section->addText("Секретарем собрания - " . User::find($organizers->user_secretary_id)->name, '', ['spaceBefore' => 10, 'align' => 'left']);
//        $section->addText("Ответственный за подсчет голосов - " . User::find($organizers->user_counter_votes_id)->name, '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addTextBreak();
        $dt_start = new \DateTime();
        $dt_start->setTimestamp(strtotime($poll->start));
        $section->addText("Администратор объявил о начале собрания в " . date_format($dt_start, "d.m.Y, H:i:s") . " по Московскому времени.", '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addText("********************************************************************", '', ['spaceBefore' => 10]);

        $count_question = 1;
        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(true);
        foreach ($poll->questions()->get() as $question) {
            $html = $this->delTags($question->text);
            $html = "По " . $count_question . " вопросу " . $html;
            //$html = $this->delTags($html);
            $textlines = explode("<br />", $html);
            $textrun = $section->addTextRun();
            $textrun->addText(array_shift($textlines));
            foreach ($textlines as $line) {
                $textrun->addTextBreak();
                $textrun->addText($line);
            }
            ++$count_question;

            if ($question->speakers()->count() > 0) {
                foreach ($question->speakers()->get() as $speaker) {
                    $speakers = explode(',', $speaker->users_speaker_id);
                    $srt_name_speakers = '';
                    foreach ($speakers as $key => $speaker_id) {
                        $srt_name_speakers .= User::find($speaker_id)->name . ', ';
                    }
                }
                $srt_name_speakers = substr($srt_name_speakers, 0, -2);
            } else {
                $srt_name_speakers = '';
            }
            $section->addTextBreak();
            $section->addText("Слушали: ", ['bold' => TRUE]);
            $section->addText($srt_name_speakers);
            $section->addTextBreak();
            $section->addText("Постановили: ", ['bold' => TRUE]);
            $html = $question->text;
            $html = $this->delTags($html);
            $textlines = explode("<br />", $html);
            $textrun = $section->addTextRun();
            $textrun->addText(array_shift($textlines));
            foreach ($textlines as $line) {
                $textrun->addTextBreak();
                $textrun->addText($line);
            }
            $section->addTextBreak();
            $section->addText("Голосовали всего: " . $poll->weightPeopleThatVote(TypeOfRight::UPON_OWNERSHIP), ['bold' => TRUE], ['spaceBefore' => 10, 'align' => 'left']);
            $section->addTextBreak();
            $count_answer_blank = 1;
            $max_voters = 0;
            $wordTable = $section->addTable(['borderSize' => 6, 'borderColor' => '999999', 'align' => 'left']);
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('№', '', ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText('Варианты ответа');
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText('Проголосовало');
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'center'])->addText('Проголосовало %');
            foreach ($question->answers()->get() as $answer) {
                if ($max_voters < $answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP)) {
                    $max_voters = $answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP);
                }
            }
            foreach ($question->answers()->get() as $answer) {
                $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
                if ($max_voters == $answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP)) {
                    $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_answer_blank, ['bold' => TRUE], ['align' => 'center', 'spaceAfter' => 150]);
                    $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText($answer->text, ['bold' => TRUE], ['valign' => 'center']);
                    $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText($answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP), ['bold' => TRUE], ['align' => 'center', 'spaceAfter' => 150]);
                    $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'center'])->addText(round(($answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP) / $poll->company->potentialWeightVotersNumber(TypeOfRight::UPON_OWNERSHIP))*100,2) . "%", ['bold' => TRUE], ['align' => 'center', 'spaceAfter' => 150]);
                } else {
                    $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_answer_blank, '', ['align' => 'center', 'spaceAfter' => 150]);
                    $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText($answer->text, '', ['valign' => 'center']);
                    $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText($answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP), '', ['align' => 'center', 'spaceAfter' => 150]);
                    $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'center'])->addText(round(($answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP) / $poll->company->potentialWeightVotersNumber(TypeOfRight::UPON_OWNERSHIP))*100,2) . "%", '', ['align' => 'center', 'spaceAfter' => 150]);
                }
                ++$count_answer_blank;
            }
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('', ['bold' => TRUE], ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText('ИТОГО', ['bold' => TRUE], ['align' => 'center']);
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText($poll->weightPeopleThatVote(TypeOfRight::UPON_OWNERSHIP).' из '.$poll->company->potentialWeightVotersNumber(TypeOfRight::UPON_OWNERSHIP), ['bold' => TRUE], ['align' => 'center']);
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'center'])->addText(round(($poll->weightPeopleThatVote(TypeOfRight::UPON_OWNERSHIP) / $poll->company->potentialWeightVotersNumber(TypeOfRight::UPON_OWNERSHIP))*100,2). "%", ['bold' => TRUE], ['align' => 'center']);
            $section->addText("********************************************************************", '', $parStyle);
        }
        $dt_end = new \DateTime();
        $dt_end->setTimestamp(strtotime($poll->finished));
        $section->addText("Администратор собрания объявил о закрытии ".$name_type_of_poll." в " . date_format($dt_end, "d.m.Y, H:i:s"), '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addTextBreak();
        $section->addText("Настоящий протокол составлен в электронной форме в соответствии с п 8.11 Устава ТСН.", '', ['spaceBefore' => 10, 'align' => 'left']);
        $section->addTextBreak();

        $count_users_with_positin = 1;
        $wordTable = $section->addTable(['borderSize' => 6, 'borderColor' => '999999', 'align' => 'left']);
        $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
        $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('№', '', ['align' => 'center', 'spaceAfter' => 150]);
        $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText('Должность');
        $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText('ФИО');
        $cell4 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'center'])->addText('Подпись');
        foreach (User::whereNotNull('position_id')->get() as $user_with_position) {
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_users_with_positin, '', ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText(Position::find($user_with_position->position_id)->position);
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText($user_with_position->name, '', ['valign' => 'center']);
            $cell4 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'bottom'])->addText('', '', ['align' => 'center', 'spaceAfter' => 150]);
            $count_users_with_positin++;
        }
//        $section->addText("Председатель собрания _____________________________".User::find($organizers->user_chairman_id)->name, '',['spaceBefore'=>10, 'align'=>'left']);
//        $section->addTextBreak();
//        $section->addText("Секретарь собрания _____________________________".User::find($organizers->user_secretary_id)->name, '',['spaceBefore'=>10, 'align'=>'left']);
//        $section->addTextBreak();
//        $section->addText("Ответственный за подсчетом голосов _____________________________".User::find($organizers->user_counter_votes_id)->name, '',['spaceBefore'=>10, 'align'=>'left']);
//        $section->addTextBreak();

        $section->addPageBreak();
        $section->addText("Список проголосовавших:", ['size' => 18, 'bold' => TRUE], ['spaceBefore' => 10, 'align' => 'center']);
        $section->addTextBreak();
        $count_users = 1;

        $wordTable = $section->addTable(['borderSize' => 6, 'borderColor' => '999999', 'align' => 'left']);
        $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
        $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('№', '', ['align' => 'center', 'spaceAfter' => 150]);
        $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText('ФИО');
        $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText('Адрес');
        $cell4 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(200), ['valign' => 'center'])->addText('Подпись');
        foreach ($poll->peopleThatVote() as $user) {
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_users, '', ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText($user->name, '', ['valign' => 'center']);
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText($user->address, '', ['valign' => 'center']);
            $cell4 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(200), ['valign' => 'bottom'])->addText('Не требуется в соответствии с п.8.11 Устава ТСН', '', ['align' => 'center', 'spaceAfter' => 150]);
            ++$count_users;
        }
        $section->addTextBreak();
        $count_users_with_positin = 1;
        $wordTable = $section->addTable(['borderSize' => 6, 'borderColor' => '999999', 'align' => 'left']);
        $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
        $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText('№', '', ['align' => 'center', 'spaceAfter' => 150]);
        $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText('Должность');
        $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText('ФИО');
        $cell4 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'center'])->addText('Подпись');
        foreach (User::whereNotNull('position_id')->get() as $user_with_position) {
            $wordTable->addRow(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50));
            $cell1 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(50), ['valign' => 'center'])->addText($count_users_with_positin, '', ['align' => 'center', 'spaceAfter' => 150]);
            $cell2 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(250), ['valign' => 'center'])->addText(Position::find($user_with_position->position_id)->position);
            $cell3 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(150), ['valign' => 'center'])->addText($user_with_position->name, '', ['valign' => 'center']);
            $cell4 = $wordTable->addCell(\PhpOffice\PhpWord\Shared\Converter::pixelToTwip(170), ['valign' => 'bottom'])->addText('', '', ['align' => 'center', 'spaceAfter' => 150]);
            $count_users_with_positin++;
        }

        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');

        if (!file_exists(base_path('storage/app/public/storage/' . $poll->id))) {
            mkdir(base_path('storage/app/public/storage/' . $poll->id));
        }

        $str_path = 'storage/app/public/storage/' . $poll->id . '/ProtocolNew.docx';
        $objWriter->save(base_path($str_path));
        $poll->update([
            'protocol_doc' => 'storage/' . $poll->id . '/ProtocolNew.docx',
        ]);
        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    function addNamespaces($xml)
    {
        $root = '<w:wordDocument
        xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml"
        xmlns:wx="http://schemas.microsoft.com/office/word/2003/auxHint"
        xmlns:o="urn:schemas-microsoft-com:office:office">';
        $root .= $xml;
        $root .= '</w:wordDocument>';
        return $root;
    }

    public function generateBlank(Poll $poll, Request $request)
    {
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor(base_path('storage/app/public/storage/TemplateBlank.docx'));

        $templateProcessor->setValue('name', $poll->name);
//**************************************************************
        $count_blank = 1;
        $replacements_blank = [];
        foreach ($poll->questions()->get() as $question) {
            $new_array = [
                'count_question_blank' => $count_blank,
                'question_text_blank'  => strip_tags($question->text),
            ];
            ++$count_blank;
            array_push($replacements_blank, $new_array);
        }
        $templateProcessor->cloneBlock('block_blank', 0, true, false, $replacements_blank);

        foreach ($poll->questions()->get() as $question) {
            $replacements_answer_blank = [];
            $count_answer_blank = 1;
            foreach ($question->answers()->get() as $answer) {
                $new_array_answer = [
                    'count_answer_blank' => $count_answer_blank,
                    'answer_text_blank'  => $answer->text,
                ];
                ++$count_answer_blank;
                array_push($replacements_answer_blank, $new_array_answer);
            }
            $templateProcessor->cloneRowAndSetValues('count_answer_blank', $replacements_answer_blank);
        }
//**************************************************************
        if (!file_exists(base_path('storage/app/public/storage/' . $poll->id))) {
            mkdir(base_path('storage/app/public/storage/' . $poll->id));
        }

        $str_path = 'storage/app/public/storage/' . $poll->id . '/Blank.docx';
        $templateProcessor->saveAs(base_path($str_path));
        $poll->update([
            'blank_doc' => '/storage/storage/' . $poll->id . '/Blank.docx',
        ]);

        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    public function generateProtocol(Poll $poll, Request $request)
    {
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor(base_path('storage/app/public/storage/TemplateProtocol.docx'));
        $num_protocol = Poll::all()->count();

        if (Organizer::where('poll_id', $poll->id)->get()->isNotEmpty()) {
            $organizers = Organizer::where('poll_id', $poll->id)->get()[0];
        } else {
            return redirect()->route('poll.results', [
                'poll' => $poll,
            ])->withErrors("Не назначены организаторы мероприятия!");;
        }

        \PhpOffice\PhpWord\Settings::setOutputEscapingEnabled(false);
        $form_protocol = 'заочная';
        $is_forum = 'не имеется';
        $yes_no = 'не';
//        }else{
//            $form_protocol = 'очная';
//            $is_forum = 'имеется';
//            $yes_no = '';
//        }
        $count = 1;
        $replacements_agenda = [];
        foreach ($poll->questions()->get() as $question) {
            $new_array_agenda = [
                'count_agenda' => $count,
                'agenda_text'  => $question->text,
            ];
            ++$count;
            array_push($replacements_agenda, $new_array_agenda);
        }
        $templateProcessor->cloneBlock('block_agenda', 0, true, false, $replacements_agenda);

//**************************************************************
        $count = 1;
        $replacements = [];
        foreach ($poll->questions()->get() as $question) {

            $new_array = [
                'count_question' => $count,
                'question_text'  => $question->text,
                // 'qourum_count_of_voting_current' => $qourum->count_of_voting_current,
            ];

            ++$count;
            array_push($replacements, $new_array);
        }
        $templateProcessor->cloneBlock('block_question', 0, true, false, $replacements);

        foreach ($poll->questions()->get() as $question) {
            $replacements_answer = [];
            $count_answer = 1;
            foreach ($question->answers()->get() as $answer) {
                $new_array_answer = [
                    'num_answer'                => $count_answer,
                    'answer_text'               => $answer->text,
                    'answer_countVotes'         => $answer->countVotes(),
                    'answer_percentOfQuestions' => $answer->percentOfQuestions($question->id, $answer->id),
                ];
                ++$count_answer;
                array_push($replacements_answer, $new_array_answer);
            }
            $templateProcessor->cloneRowAndSetValues('num_answer', $replacements_answer);
        }
//**************************************************************

//**************************************************************
        $users_all = Company::find(session('current_company')->id)->users()->get();
        $count = 1;
        $replacements_users = [];
        foreach ($users_all as $user) {
            if (in_array($user->id, explode(',', $qourum->list_of_all_current_users))) {
                $new_array = ['num_users' => $count, 'user_name' => $user->name];
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
        foreach ($invited as $key => $invite) {
            $srt_name_invited .= User::find($invite)->name . ', ';
        }
        $srt_name_invited = substr($srt_name_invited, 0, -2);

        foreach ($poll->questions()->get() as $question) {
            foreach ($question->speakers()->get() as $speaker) {
                $speakers = explode(',', $speaker->users_speaker_id);
                $srt_name_speakers = '';
                foreach ($speakers as $key => $speaker_id) {
                    $srt_name_speakers .= User::find($speaker_id)->name . ', ';
                }
            }
        }
        $srt_name_speakers = substr($srt_name_invited, 0, -2);

        $templateProcessor->setValue('num_protocol', $num_protocol);
        $templateProcessor->setValue('name', $poll->name);
        $templateProcessor->setValue('invited', $srt_name_invited);
        $templateProcessor->setValue('speakers', $srt_name_speakers);
        $templateProcessor->setValue('date', date_format($dt_start, "d.m.Y"));
        $templateProcessor->setValue('form', $form_protocol);
        //$templateProcessor->setValue('agenda', htmlspecialchars($text_agenda));
        $templateProcessor->setValue('all_users', $poll->potential_voters_number);
        //$templateProcessor->setValue('current_sum_users', $qourum->count_of_voting_current);
        $templateProcessor->setValue('is_quorum', $is_forum);
        $templateProcessor->setValue('yes_no', $yes_no);
        $templateProcessor->setValue('chairman', User::find($organizers->user_chairman_id)->name);
        $templateProcessor->setValue('secretary', User::find($organizers->user_secretary_id)->name);
        $templateProcessor->setValue('counter_vote', User::find($organizers->user_counter_votes_id)->name);
        //$templateProcessor->setValue('current_sum_users_yes', $qourum->count_of_voting_current );
        $templateProcessor->setValue('current_sum_users_no', 0);
        $templateProcessor->setValue('current_sum_users_nothing', 0);
        $templateProcessor->setValue('start', date_format($dt_start, "d.m.Y, H:i:s"));
        //$templateProcessor->setValue('text_question_answer', htmlspecialchars($text_question_answer));

        $dt_end = new \DateTime();
        $dt_end->setTimestamp(strtotime($poll->finished));

        $templateProcessor->setValue('close', date_format($dt_end, "d.m.Y, H:i:s"));
        if (!file_exists(base_path('storage/app/public/storage/' . $poll->id))) {
            mkdir(base_path('storage/app/public/storage/' . $poll->id));
        }

        $str_path = 'storage/app/public/storage/' . $poll->id . '/Protocol.docx';
        $templateProcessor->saveAs(base_path($str_path));
        $poll->update([
            'protocol_doc' => '/storage/storage/' . $poll->id . '/Protocol.docx',
        ]);

        return redirect()->route('poll.results', [
            'poll' => $poll,
        ]);
    }

    public function addProtocol(Request $request, $poll_id)
    {
        $poll = Poll::find($poll_id);
        $error = '';
        if ($request->hasFile(key($request->file())) && $request->file(key($request->file()))->isValid()) {
            $rules[key($request->file())] = 'file';
        } else {
            if ($request->file(key($request->file()))) {
                $error = 'Файл ' . $request->file(key($request->file()))->getClientOriginalName() . ' поврежден!';
                return redirect()->route('poll.edit', [
                    'poll'  => $poll->id,
                    'error' => $error,
                ]);
            } else {

                \JavaScript::put([
                    'poll'          => $poll,
                    'csrf_token'    => csrf_token(),
                    'file_protocol' => '',
                    'error'         => '',
                    'is_admin'      => auth()->user()->isAdmin(),
                ]);

                return redirect()->route('poll.edit', [
                    'poll'  => $poll,
                    'error' => '',
                ]);
            }
        }

        $parameters = $this->validate($request, $rules);

        $path_to_protocol = $poll->update([
            'protocol' => $request->file(key($request->file()))->store('storage/' . $poll->id, 'public'),
        ]);

        \JavaScript::put([
            'poll'          => $poll,
            'csrf_token'    => csrf_token(),
            'file_protocol' => $poll->protocol,
            'error'         => $error,
        ]);

        return redirect()->route('poll.edit', [
            'poll'  => $poll,
            'error' => $error,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request)
    {
        if (!session('current_company')) {
            return redirect()->route('polls.index');
        }
        $poll = Poll::find($request['del_poll']);
        $poll->delete();
        return redirect()->route('polls.index', [
            'polls'   => Poll::where('company_id', session('current_company')->id)->get(),
            'poll_id' => '0',
            //'users' => User::where('company_id', session('current_company')->id)->get(),
            //'siteTitle' => session('current_company')->title
        ]);
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
        if (!session('current_company')) {
            return redirect()->route('polls.index');
        }
        $rules["type_of_poll"] = 'required';
        $rules["poll-name"] = 'required';
        $parameters = $this->validate($request, $rules);

        $poll = Poll::create([
            'name'         => $parameters['poll-name'],
            'type_of_poll' => $parameters['type_of_poll'],
            'company_id'   => session('current_company')->id,
        ]);

        return redirect()->route('poll.questions.create', ['poll' => $poll->id]);
    }

    public function addQuestion(Request $request, Poll $poll)
    {
        if (!session('current_company')) {
            return redirect()->route('polls.index');
        }
        //dd($request->input());
        $inputs = $request->input();
        foreach ($inputs as $key => $input) {
            if (strpos($key, 'question_text_') === false) {
            } else {
                $question_text_id = preg_replace('/question_text_/', '', $key);
                $rules["question_text_" . $question_text_id] = 'required';
            }
            if (strpos($key, 'text_for_') === false) {
            } else {

                $rules[$key] = 'required';
                $file_id = preg_replace('/file_text_for_/', '', $key);
                if ($request->hasFile($file_id) && $request->file($file_id)->isValid()) {
                    $rules[$file_id] = 'file';
                }
            }
            if (strpos($key, 'text_answer_') === false) {
            } else {
                $rules[$key] = 'required';
            }

            if (strpos($key, 'QuestionPublic') === false) {
            } else {
                $rules[$key] = 'required';
            }
            if (strpos($key, 'SuggestedQuestion') === false) {
            } else {
                $rules[$key] = 'required';
            }
            if (strpos($key, 'QuestionEditingDone_') === false) {
            } else {
                $rules[$key] = 'required';
            }
        }
        $parameters = $this->validate($request, $rules);
        $flag = false;
        $is_update_file = false;
        $indexes_of_files = [];
        $indexes_of_answers = [];
        //dd($parameters);
        foreach ($parameters as $key => $value) {
            if (strpos($key, 'question_text_') === false) {
            } else {
                $question_text_id = preg_replace('/question_text_/', '', $key);
                if ($question_text_id == '0') {
                    $question = $poll->questions()->create([
                        'poll_id'    => $poll->id,
                        'text'       => $value,
                        'author'     => auth()->user()->id,
                        'company_id' => session('current_company')->id,
                    ]);
                    $question_text_id = $question->id;
                } else {
                    try {
                        $question = $poll->questions()->updateOrInsert(
                            ['id' => $question_text_id, 'poll_id' => $poll->id, 'author' => auth()->user()->id],
                            [
                                'text'       => $value,
                                'company_id' => session('current_company')->id,
                            ]
                        );
                    }catch (\Throwable $e) {
                        \Log::error($e);
                        return redirect()->route('poll.questions.index',
                            ['poll' => $poll->id, 'id_question' => $question->id, 'error'=> 'Нельзя менять данные другого автора!']);
                    }

                    $question = Question::find($question_text_id);
                }
            }
            if (strpos($key, 'text_for_') === false) {
            } else {
                $flag = true;
                $file_id = preg_replace('/file_text_for_/', '', $key);
                foreach ($question->question_files()->get() as $file) {
                    if ($file->id == $file_id) {
                        $data_questions = $file->update([
                            'text_for_file' => $value,
                        ]);
                        array_push($indexes_of_files, $file->id);
                        break;
                    }
                }

                if ($request->hasFile($file_id) && $request->file($file_id)->isValid()) {
                    if ($question->question_files()->where('id', $file_id)->count() > 0) {
                        //ddd($file);
                        Storage::disk('public')->delete($file->path_to_file);
                        $file_new = $question->question_files()->updateOrInsert(
                            ['id' => $file_id, 'question_id' => $question->id],
                            [
                                'text_for_file' => $value,
                                'path_to_file'  => $request->file($file_id)->store('storage/' . $poll->id . '/' . $question_text_id, 'public'),
                            ])->get();
                        $is_update_file = true;
                    } else {
                        $file_new = $question->question_files()->create(
                            [
                                'text_for_file' => $value,
                                'path_to_file'  => $request->file($file_id)->store('storage/' . $poll->id . '/' . $question_text_id, 'public'),
                            ]);
                    }
                    if (!$is_update_file) {
                        if (isset($file_new[0])) {
                            array_push($indexes_of_files, $file_new[0]->id);
                        } else {
                            array_push($indexes_of_files, $file_new->id);
                        }
                    }
                }
                if ($request->file($file_id)) {
                    if (!$request->file($file_id)->isValid()) {
                        $str = 'Файл ' . $request->file($file_id)->getClientOriginalName() . ' поврежден!';
                        return redirect()->route('poll.questions.index', ['poll' => $poll->id, 'id_question' => $question_text_id, 'error' => $str]);
                    }
                }
            }
            //ddd($indexes_of_files);

            if (strpos($key, 'text_answer_') === false) {
            } else {
                $answer_id = preg_replace('/text_answer_/', '', $key);
                if ($question->answers()->where('id', $answer_id)->count() > 0) {
                    $answer_update = $question->answers()->updateOrInsert(
                        ['id' => $answer_id, 'question_id' => $question->id],
                        ['text' => $value]
                    )->get();
                    array_push($indexes_of_answers, $answer_update[0]->id);
                } else {
                    $answer_new = $question->answers()->create(
                        ['text' => $value]
                    );
                    array_push($indexes_of_answers, $answer_new->id);
                }

            }
            if (strpos($key, 'QuestionPublic') === false) {
            } else {
                if ($parameters[$key] == 'on') {
                    $question->update([
                        'public' => 1,
                    ]);
                } else {
                    $question->update([
                        'public' => 0,
                    ]);
                }
            }
            if (strpos($key, 'SuggestedQuestion') === false) {
            } else {
                if ($parameters[$key] == 'on') {
                    $question->update([
                        'suggest' => 1,
                    ]);
                } else {
                    $question->update([
                        'suggest' => 0,
                    ]);
                }
            }

            if (strpos($key, 'QuestionEditingDone_') === false) {
            } else {
                if (!isset($question)) {
                    $question_editing_id = preg_replace('/QuestionEditingDone_/', '', $key);
                    $question = Question::find($question_editing_id);
                }
                if ($parameters[$key] == 'on') {
                    $question->update([
                        'is_editing' => 0,
                    ]);
                    $poll->update([
                        'start' => date('Y-m-d H:i:s'),
                    ]);
                } else {
                    $question->update([
                        'is_editing' => 1,
                    ]);
                    $poll->update([
                        'start' => null,
                    ]);
                }
            }

        }

        $poll->reSortQuestions();

        if (!isset($parameters['SuggestedQuestion'])) {
            $question->update([
                'suggest' => 0,
            ]);
        }

        if (!isset($parameters['QuestionEditingDone_' . $question->id])) {
            $question->update([
                'is_editing' => 1,
            ]);
        }

        if (!$flag && $question->question_files()->count() > 0) {
            foreach ($question->question_files()->get() as $file) {
                Storage::disk('public')->delete($file->path_to_file);
                $file->delete();
            }
        } else {
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
        if ($question->suggest) {
            return redirect()->route('poll.questions.view_suggested_questions');
        } else {
            return redirect()->route('poll.edit', [
                'poll' => $poll,
            ]);
        }
    }
    /**
     * Display the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */

    //// polls/7
    public function show(Poll $poll)
    {
        $displayMode = true;

        $question = $poll->questions()->where('id', request('question_id'))->first();

        \JavaScript::put([
            'questionsCount'          => $poll->questions->count(),
            'displayMode'             => $displayMode,
            'canVote'                 => auth()->user()->canVote(),
            'pollId'                  => $poll->id,
            'isTypeReport'            => $poll->isReportDone(),
            'isInformationPost'       => $poll->isInformationPost(),
            'voteUrl'                 => route('poll.submit', ['poll' => $poll]),
            'initialQuestionPosition' => $question ? $question->position_in_poll : 1,
        ]);

        return view('polls.display', [
            'poll'        => $poll,
            'displayMode' => $displayMode,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function display(Poll $poll)
    {
        if (!$poll->voteStarted()) {
            abort(403, 'Голосование ещё не началось');
        }

        $displayMode = false;

        \JavaScript::put([
            'questionsCount'    => $poll->questions->count(),
            'displayMode'       => $displayMode,
            'canVote'           => auth()->user()->canVote(),
            'pollId'            => $poll->id,
            'isTypeReport'      => $poll->isReportDone(),
            'isInformationPost' => $poll->isInformationPost(),
            'voteUrl'           => route('poll.submit', ['poll' => $poll]),
            'initialQuestionPosition' => 1,
        ]);

        return view('polls.display', [
            'poll'        => $poll,
            'displayMode' => $displayMode,
        ]);

    }

    public function start(Poll $poll, $start)
    {
        date_default_timezone_set ('Europe/Moscow'); //locate!
        if ($start){
            $poll->update([
                'start' => date("Y-m-d H:i:s", $start/1000)
            ]);
        }else{
            $poll->update([
                'start' => null,
            ]);
        }

        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    public function endVote(Poll $poll, $end)
    {
        $potentialVotersNumber = $poll->isGovernanceMeeting()
            ? $poll->company->potentialWeightVotersNumberGovernance(TypeOfRight::UPON_OWNERSHIP) //$poll->company->potentialVotersNumberGovernance()
            : $poll->company->potentialWeightVotersNumber(TypeOfRight::UPON_OWNERSHIP); //$poll->company->potentialVotersNumber();

        date_default_timezone_set ('Europe/Moscow'); //locate!
        if (!$poll->finished) {
            $poll->update([
                'finished'                => date("Y-m-d H:i:s", intdiv ($end,1000)),
                'potential_voters_number' => $potentialVotersNumber,
            ]);
        } else {
            if ($end){
                $poll->update([
                    'finished' => date("Y-m-d H:i:s", intdiv ($end,1000)),
                    'potential_voters_number' => $potentialVotersNumber,
                ]);
            }else{
                $poll->update([
                    'finished' => null,
                    'potential_voters_number' => 0,
                ]);
            }
        }

        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    function recurs($parent_id, $items_id)
    {
        $sons_id = DB::select("SELECT id FROM items where parent_id = ? AND id NOT IN (?)", [$parent_id, $items_id]);
        foreach ($sons_id as $son_id)
            if ($son_id) {
                recurs($son_id, $items_id);
            } else {
                return;
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

    public function report_dont_voted(Poll $poll)
    {
        if (!session('current_company')) {
            return redirect()->route('polls.index');
        }
        $out = [];

        if ($poll->isGovernanceMeeting()) {
            $out = $poll->peopleThatDidNotVoteGovernance();
        } else {
            $out = $poll->peopleThatDidNotVoteVoters();
        }

        $str = '<table class=\'min-w-full divide-y divide-gray-200\'>';
        $str .= '<thead class=\'bg-gray-50\'>
                        <tr>
                                <th scope=\'col\' class=\'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\'>
                                        №
                                </th>
                                <th scope=\'col\' class=\'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\'>
                                        ФИО
                                </th>
                                <th scope=\'col\' class=\'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\'>
                                        Адрес
                                </th>
                                <th scope=\'col\' class=\'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider\'>
                                        Телефон
                                </th>
                        </tr>
                        </thead>
                        <tbody>';
        $cnt = 1;
        foreach ($out as $user) {
            if ($user->canVote() && ($user->isHaveCompany(session('current_company')))) {
                if ($poll->isGovernanceMeeting() && $user->isGovernance()) {
                    $str_class = ($cnt % 2) ? 'bg-white' : 'bg-gray-200';
                    $str .= '<tr class=\'bg-white bg-gray-100 border-b border-gray-400 text-wrap ' . $str_class . '\'>';
                    $str .= '<td class=\'text-center\'>' . $cnt . '</td><td>' . $user->name . '</td><td>' . $user->address . '</td><td>' . $user->phone . '</td><td>';
                    $str .= '</tr>';
                    ++$cnt;
                } elseif (!$poll->isGovernanceMeeting()) {
                    $str_class = ($cnt % 2) ? 'bg-white' : 'bg-gray-200';
                    $str .= '<tr class=\'bg-white bg-gray-100 border-b border-gray-400 text-wrap ' . $str_class . '\'>';
                    $str .= '<td class=\'text-center\'>' . $cnt . '</td><td>' . $user->name . '</td><td>' . $user->address . '</td><td>' . $user->phone . '</td><td>';
                    $str .= '</tr>';
                    ++$cnt;
                }
            }
        }
        $str .= '</tbody></table>';
        return view('polls.report_dont_voted', [
            'poll' => $poll,
            'str'  => $str,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function report_voted(Poll $poll)
    {
        $out = [];

        $poll->peopleThatVote()->groupBy('parent_id')->each(function ($group, $groupId) use (&$out) {
            $parent = Item::find($groupId);

            $hierarchy = $parent->getTopHierarchy();

            $out[$groupId] = [
                'group'     => $group,
                'hierarchy' => $hierarchy,
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
                        $str1 = "<th style=\"border: 1px solid grey;\">" . $hierarchy['item']->name . "</th>" . $str1;
                    }
                    $str .= $str1 . "<th style=\"border: 1px solid grey;\">Первичная ячейка</th></tr>";
                    $str .= '<tr>';
                    foreach ($items as $hierarchy) {
                        $chairman_name = $hierarchy['chairman'] ? $hierarchy['chairman']->name : '';
                        $chairman_phone = $hierarchy['chairman'] ? $hierarchy['chairman']->phone : '';
                        $str2 = "<td style=\"border: 1px solid grey;\">" . $chairman_name . " <br /> " . $chairman_phone . "</td>" . $str2;
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
                        $hierarchy_str[$index] .= $item->name . ' - ' . $item->phone . "<br />";
                    }
                    $hierarchy_str[$index] .= "</td></tr></table>";
                    $index++;
                }
            }
        }
        if (isset($hierarchy_str)) {
            arsort($hierarchy_str);
        } else {
            $hierarchy_str = [];
        }
        return view('polls.report_voted', [
            'poll'        => $poll,
            'out'         => $out,
            'arr_strings' => $hierarchy_str,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function report(Poll $poll)
    {
        $out = [];

        $poll->peopleThatDidNotVote()->groupBy('parent_id')->each(function ($group, $groupId) use (&$out) {
            $parent = Item::find($groupId);
            if (!is_null($parent)) {
                $hierarchy = $parent->getTopHierarchy();

                $out[$groupId] = [
                    'group'     => $group,
                    'hierarchy' => $hierarchy,
                ];
            }
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
                        $str1 = "<th style=\"border: 1px solid grey;\">" . $hierarchy['item']->name . "</th>" . $str1;
                    }
                    $str .= $str1 . "<th style=\"border: 1px solid grey;\">Первичная ячейка</th></tr>";
                    $str .= '<tr>';
                    foreach ($items as $hierarchy) {
                        $chairman_name = $hierarchy['chairman'] ? $hierarchy['chairman']->name : '';
                        $chairman_phone = $hierarchy['chairman'] ? $hierarchy['chairman']->phone : '';
                        $str2 = "<td style=\"border: 1px solid grey;\">" . $chairman_name . " <br /> " . $chairman_phone . "</td>" . $str2;
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
                        $hierarchy_str[$index] .= $item->name . ' - ' . $item->phone . "<br />";
                    }
                    $hierarchy_str[$index] .= "</td></tr></table>";
                    $index++;
                }
            }
        }
        if (empty($out)) {
            $hierarchy_str = [];
        }
        if (is_null($hierarchy_str)) {
            arsort($hierarchy_str);
        }
        return view('polls.report', [
            'poll'        => $poll,
            'out'         => $out,
            'arr_strings' => $hierarchy_str,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function results(Poll $poll)
    {
        $countByQuestion = [];
        $answers = [];
        $countVotedForAnswer = [];
        $middleAnswerThatAllUsersMarkOnReport = [];
        $questionMaxCountVotes = [];
        $countWeightsVotedForAnswer = [];
        foreach ($poll->questions as $question) {
            $countByQuestion[$question->id] = $question->countVotesByQuestion();
            $countWeightsByQuestion[$question->id] = $question->countWeightVotesByQuestion(TypeOfRight::UPON_OWNERSHIP);
            $maxCountVotes = 0;
            foreach ($question->answers()->get() as $answer) {
                $answers[$question->id][] = $answer;
                if ($answer->countVotes() > $maxCountVotes) {
                    $maxCountVotes = $answer->countVotes();
                }
                $countVotedForAnswer[$answer->id] = $answer->countVotes();
                $countWeightsVotedForAnswer[$answer->id] = $answer->countVotesWeight(TypeOfRight::UPON_OWNERSHIP);
                $middleAnswerThatAllUsersMarkOnReport [$question->id] = $question->middleAnswerThatAllUsersMarkOnReport();
            }
            $questionMaxCountVotes[$question->id] = $maxCountVotes;
        }

        \JavaScript::put([
            'questions'                            => $poll->questions()->get(),
            'poll_report_done'                     => $poll->isReportDone(),
            'answers'                              => $answers,
            'countVotedForAnswer'                  => $countVotedForAnswer,
            'poll'                                 => $poll,
            'countByQuestion'                      => $countByQuestion,
            'middleAnswerThatAllUsersMarkOnReport' => $middleAnswerThatAllUsersMarkOnReport,
            'questionMaxCountVotes'                => $questionMaxCountVotes,
            'countWeightsVotedForAnswer'           => $countWeightsVotedForAnswer,
            'countWeightsByQuestion'               => $countWeightsByQuestion
        ]);
        return view('polls.results', [
            'poll'   => $poll,
            'quorum' => $poll->potential_voters_number,
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function results_list(Poll $poll)
    {
        return view('polls.results_list', [
            'poll'             => $poll,
            'itemsNameHash'    => Company::find(session('current_company')->id)->users()->get()->pluck('name', 'id'),
            'itemsPhoneHash'   => Company::find(session('current_company')->id)->users()->get()->pluck('phone', 'id'),
            'itemsAddressHash' => Company::find(session('current_company')->id)->users()->get()->pluck('address', 'id'),
            'itemsIdHash'      => Company::find(session('current_company')->id)->users()->get()->pluck('id', 'id'),
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Poll $poll
     *
     * @return string[]
     */
    public function submit(Request $request, Poll $poll)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();

        $pollQuestionsCount = $poll->questions->count();
        $isPollRegular = !$poll->isReportDone();

        if ($user->votedInPoll($poll) && $isPollRegular) {
            return [
                'errorMessage' => 'Вы уже проголосовали по данному вопросу!',
            ];
        }

        $votes = request('votes');
        if (empty($votes)) {
            return [
                'errorMessage' => 'Ошибка данных',
            ];
        }

        $votesCount = count($votes);

        if ($isPollRegular && $pollQuestionsCount !== $votesCount) {
            return [
                'errorMessage' => 'Вы ответили не на все вопросы',
            ];
        }

        if ($poll->isGovernanceMeeting() && !$user->isGovernance()) {
            return [
                'errorMessage' => 'Невозможно проголосовать - Вы не являетесь членом правления'
            ];
        }

        if (!$poll->voteStarted()) {
            return [
                'errorMessage' => 'Голосование ещё не началось'
            ];
        }

        foreach ($votes as $questionId => $answerId) {
            $question = Question::find($questionId);
            if (!$question) {
                return [
                    'errorMessage' => 'Вопрос не найден',
                ];
            }

            $answer = Answer::find($answerId);
            if (!$answer) {
                return [
                    'errorMessage' => 'Ответ не найден',
                ];
            }

            $user->vote($question, $answer);
        }

        if ($poll->isSuggestedQuestion()) {
            $count_all_voters = $poll->potential_voters_number;

            if (round($count_all_voters / 2, 0, PHP_ROUND_HALF_UP) <= $poll->peopleThatVote()->count()) {
                $poll->questions()->first()->update([
                    'accepted' => true,
                ]);
            }
        }

        return [
            'success' => true,
            'message' => 'Успех!'
        ];
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Poll $poll, $error = '')
    {
        foreach ($poll->questions as $question) {
            $cnt_files_in_question [$question->id] = $question->question_files()->count();
        }
        if ($poll->questions->count() == 0) {
            $cnt_files_in_question = [];
        }

        \JavaScript::put([
            'poll'                  => $poll->id,
            'csrf_token'            => csrf_token(),
            'file_protocol'         => $poll->protocol ? $poll->protocol : '',
            'is_admin'              => auth()->user()->isAdmin(),
            'error'                 => $error,
            'questions'             => $poll->questions,
            'cnt_files_in_question' => $cnt_files_in_question,
            'poll_finished'         => $poll->voteFinished(),
            'poll_start'            => $poll->voteStarted(),
            'poll_full'             => $poll
        ]);

        return view('polls.update', [
            'poll' => $poll,
        ]);
    }

    public function agenda(Poll $poll)
    {
        foreach ($poll->questions as $question) {
            $cnt_files_in_question [$question->id] = $question->question_files()->count();
        }
        if ($poll->questions->count() == 0) {
            $cnt_files_in_question = [];
        }
        \JavaScript::put([
            'poll'                  => $poll->id,
            'csrf_token'            => csrf_token(),
            'file_protocol'         => $poll->protocol ? $poll->protocol : '',
            'is_admin'              => auth()->user()->isAdmin(),
            'questions'             => $poll->questions,
            'cnt_files_in_question' => $cnt_files_in_question,
            'poll_finished'         => $poll->voteFinished(),
            'poll_full'             => $poll,
            'uri'                   => env('APP_URL'),
        ]);

        return view('polls.update', [
            'poll' => $poll,
        ]);
    }

    public function requisites(Poll $poll)
    {
        if (!session('current_company')) {
            return redirect()->route('polls.index');
        }
        \JavaScript::put([
            'poll'                  => $poll->id,
            'csrf_token'            => csrf_token(),
            'is_admin'              => auth()->user()->isAdmin(),
            'poll_finished'         => $poll->voteFinished(),
            'poll_full'             => $poll,

        ]);
        return view('polls.requisites', [
            'poll'       => $poll,
            'error'      => '',
            'users'      => Company::find(session('current_company')->id)->users()->get(),
            'organizers' => Organizer::where('poll_id', $poll->id)->count() > 0 ? Organizer::where('poll_id', $poll->id)->get()[0] : '',
            'quorum'     => $poll->potential_voters_number,
        ]);
    }

    public function requisitesSubmitName(Poll $poll, Request $request)
    {
        if ($poll->id && isset($request->poll_name)) {
            $poll->update([
                'name' => $request->poll_name,
            ]);
        }

        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ]);
    }

    public function countCanVote()
    {
        $count = 0;
        $users = Company::find(session('current_company')->id)->users()->get();
        foreach ($users as $user) {
            if (in_array(Permission::VOTE, explode(',', $user->permissions))) {
                ++$count;
            }
        }
        return $count;
    }

    public function requisitesSubmitOrganizers(Poll $poll, Request $request)
    {
        $error = '';

        if ($poll->id) {
            if (($request->chairman !== $request->secretary) && ($request->chairman !== $request->counter_votes) && ($request->secretary !== $request->counter_votes)) {
                Organizer::updateOrCreate([
                    'poll_id' => $poll->id,
                ],
                    [
                        'user_chairman_id'      => $request->chairman,
                        'user_secretary_id'     => $request->secretary,
                        'user_counter_votes_id' => $request->counter_votes,
                    ]
                );
            } else {
                $error = 'Один и тот же человек не может занимать больше одной должности!';
            }
        }
        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ])->withErrors($error);
    }

    public function requisitesSubmitInvited(Poll $poll, Request $request)
    {
        $error = '';
        $users_invited_is = implode(',', $request->invited);
        Organizer::updateOrCreate([
            'poll_id' => $poll->id,
        ],
            [
                'users_invited_id' => $users_invited_is,
            ]
        );
        return redirect()->route('poll.requisites', [
            'poll' => $poll,
        ])->withErrors($error);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function update(Poll $poll)
    {

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Poll $poll
     *
     * @return \Illuminate\Http\Response
     */
    public function destroy(Poll $poll)
    {
        //
    }
}
