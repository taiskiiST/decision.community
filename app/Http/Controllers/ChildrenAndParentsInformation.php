<?php

namespace App\Http\Controllers;

use App\Models\ChildrenInformation;
use App\Models\ParentInformation;
use DateTime;
use DateTimeZone;
use Illuminate\Http\Request;

class ChildrenAndParentsInformation extends Controller
{
    public function index()
    {
        \JavaScript::put([
            'csrf_token'         => csrf_token(),
        ]);
        return view('children-and-parents-info.index');
    }

    public function indexSchool()
    {
        \JavaScript::put([
            'csrf_token'         => csrf_token(),
        ]);
        return view('children-and-parents-info.school-information');
    }

    public function submit(Request $request)
    {
        $inputs = $request->input();
        if ($this->checkInputs ($inputs)) {
            $countOfChildren = $this->checkCountOfChildren($inputs);
            $parent_information = ParentInformation::create([
                'full_name'         => $inputs ['parent_name'],
                'relationship' => $inputs ['parent_relationship'],
                'address'   => $inputs ['parent_address'],
                'phone'   => $inputs ['parent_phone'],
            ]);

            for ($i = 0; $i < $countOfChildren; $i++){
                ChildrenInformation::create([
                    'full_name'         => $inputs ['child-name-'.$i],
                    'parents_id' => $parent_information->id,
                    'sex' => $inputs ['child-sex-'.$i],
                    'date_of_birthday'   => $inputs ['date-birthday-'.$i]
                ]);
            }
            return redirect()->route('children-and-parents-information-done');
        }else{
            return redirect()->route('children-and-parents-information')->withErrors('Все поля обязательны для заполнения!');
        }
    }

    public function submitSchool(Request $request)
    {
        $inputs = $request->input();
        //dd($inputs);
        if ($this->checkInputs ($inputs)) {
            $countOfChildren = $this->checkCountOfChildren($inputs);
            $parent_information = ParentInformation::create([
                'full_name'         => $inputs ['parent_name'],
                'relationship' => $inputs ['parent_relationship'],
                'address'   => $inputs ['parent_address'],
                'phone'   => $inputs ['parent_phone'],
                'school_information' => true
            ]);

            for ($i = 0; $i < $countOfChildren; $i++){
                ChildrenInformation::create([
                    'full_name'         => $inputs ['child-name-'.$i],
                    'parents_id' => $parent_information->id,
                    'sex' => $inputs ['child-sex-'.$i],
                    'date_of_birthday'   => $inputs ['date-birthday-'.$i],
                    'school_name'   => $inputs ['school-name-'.$i],
                    'school_address'   => $inputs ['school-address-'.$i],
                    'school_time_to'   => $inputs ['school-time-to-'.$i],
                    'school_time_from'   => $inputs ['school-time-from-'.$i]
                ]);
            }
            return redirect()->route('children-and-parents-information-school-done');
        }else{
            return redirect()->route('children-and-parents-information-school')->withErrors('Все поля обязательны для заполнения!');
        }
    }



    public function checkInputs($inputs)
    {
        foreach ($inputs as $input){
            if ( empty ($input)){
                return false;
            }
        }
        return true;
    }

    public function checkCountOfChildren($inputs)
    {
        $cnt = 0;
        foreach ($inputs as $key => $input){
            if (preg_match('/child-name/',$key)){
                $cnt++;
            }
        }
        return $cnt;
    }

    public function done()
    {
        $countChildren = ChildrenInformation::all()->where('school_name','=','')->count();
        return view('children-and-parents-info.done', ['count_children'=>$countChildren]);
    }

    public function doneSchool()
    {
        $countChildren = ChildrenInformation::all()->where('school_name','<>','')->count();
        return view('children-and-parents-info.done-school', ['count_children'=>$countChildren]);
    }

    public function checkParent()
    {
        return view('children-and-parents-info.check-parent');
    }

    public function report()
    {
        $information = [];
        $parents = ParentInformation::all()->where('school_information','<>','1');
        //$count_of_parents = $parents->count();
        foreach ($parents as $key => $parent){
            $information[$key]['full_name'] = $parent['full_name'];
            $information[$key]['relationship'] = $parent['relationship'];
            $information[$key]['address'] = $parent['address'];
            $information[$key]['phone'] = $parent['phone'];
            $information[$key]['children_count'] = $parent->children()->count();
            foreach ($parent->children()->get() as $key_child => $child){
                $information[$key]['child_'.$key_child]['full_name'] = $child['full_name'];
                $information[$key]['child_'.$key_child]['sex'] = $child['sex'];
                $time = strtotime($child['date_of_birthday']);
                $newformat = date('d.m.Y',$time);
                $information[$key]['child_'.$key_child]['date_of_birthday'] = $newformat;
                $information[$key]['child_'.$key_child]['age'] = $this->ageCalculator($newformat);

            }
        }
        //dd($information);
        return view('children-and-parents-info.report',
            [
                'informations' => $information,
            ]);
    }

    public function reportAge()
    {
        $informations = [];
        $children = ChildrenInformation::all()->where('school_name','=','');
        //dd($children);
        foreach ($children as $child){
            //$information['address'][] = $child->parent()->get()[0]->address;
            $time = strtotime($child->date_of_birthday);
            $newformat = date('d.m.Y',$time);
            $informations['age'][] = $this->ageCalculator($newformat);
        }
        $ageArr = [];
        for($i=0;$i<19;$i++){
            foreach ($informations['age'] as $information){
                if ($i == $information){
                    if (isset ($ageArr[$i]) ){
                        $ageArr[$i] += 1;
                    }else{
                        $ageArr[$i] = 1;
                    }
                }
            }
        }
        $ageByGroup = [];
        $cnt = 0;
        foreach ($ageArr as $age => $count_age){
            $ageByGroup[$cnt]['group_age'] = $age;
            $ageByGroup[$cnt]['count_of_group_age'] = $count_age;
            $cnt++;
        }
        return view('children-and-parents-info.report-age',
            [
                'age_by_group' => $ageByGroup,
                'total_count_children' => ChildrenInformation::all()->where('school_name','=','')->count()
            ]);
    }

    public function schoolReport(Request $request)
    {
        $inputs = $request->input();
        $parent = ParentInformation::all()->where('phone',"LIKE", $inputs['phone'])->first();

        if ($parent){
            $informations = [];
            $children = ChildrenInformation::all()->where('school_name','<>','');
            foreach ($children as $child){
                $time = strtotime($child->date_of_birthday);
                $newformat = date('d.m.Y',$time);
                $informations[$child->id]['age'] = $this->ageCalculator($newformat);
            }

            $ageArr = [];
            foreach ($children as $child) {
                for ($i = 0; $i < 19; $i++) {
                    foreach ($informations[$child->id] as $age) {
                        if ($i == $age) {
                            $ageArr[$i][$child->id][] = $child->full_name;
                            //$ageArr[$i][$child->id][] = $child->date_of_birthday;
                            $ageArr[$i][$child->id][] = $child->sex;
                            $ageArr[$i][$child->id][] = $child->school_name;
                            $ageArr[$i][$child->id][] = $child->school_address;
                            $ageArr[$i][$child->id][] = $child->school_time_to;
                            $ageArr[$i][$child->id][] = $child->school_time_from;
                        }
                    }
                }
            }
            //dd($ageArr);
            return view('children-and-parents-info.school-report',
                [
                    'age_by_group' => $ageArr,
                    'total_count_children' => ChildrenInformation::all()->where('school_name','<>','')->count()
                ]);
        }else {
            return redirect()->route('check-parent')->withErrors('Данный номер телефона не найден!');
        }
    }
    public function ageCalculator($newformat){
        $tz  = new DateTimeZone('Europe/Brussels');
        $age = DateTime::createFromFormat('d.m.Y', $newformat, $tz)
            ->diff(new DateTime('now', $tz))
            ->y;
        return $age;
    }

}
