<?php

namespace App\Http\Controllers;

use App\Models\ChildrenInformation;
use App\Models\ParentInformation;
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
        $countChildren = ChildrenInformation::all()->count();
        return view('children-and-parents-info.done', ['count_children'=>$countChildren]);
    }

    public function report()
    {
        $information = [];
        $parents = ParentInformation::all();
        $count_of_parents = $parents->count();
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
        return view('children-and-parents-info.report',
            [
                'informations' => $information,
            ]);
    }

    public function ageCalculator($newformat){
        //explode the date to get month, day and year
        $birthDate = explode(".", $newformat);
        //get age from date or birthdate
        $age = (date("md", date("U", mktime(0, 0, 0, $birthDate[0], $birthDate[1], $birthDate[2]))) > date("md")
            ? ((date("Y") - $birthDate[2]) - 1)
            : (date("Y") - $birthDate[2]));
        return $age;
    }

}
