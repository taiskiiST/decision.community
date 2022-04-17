<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Position;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UsersController extends Controller
{
    public function index(){
        $users = User::all();
        return view('users.index',['users' => $users]);
    }
    public function addOrUpdateForm(Request $request){
        $permissions =  Permission::allPermission();
        $permissions_name = [];
        foreach ($permissions as $permission){
            switch ($permission){
                case $permission == Permission::ADMIN :
                {
                    array_push($permissions_name, [Permission::ADMIN => 'Администратор']);
                    break;
                }
                case $permission == Permission::VOTE :
                {
                    array_push($permissions_name, [Permission::VOTE => 'Член ТСН']);
                    break;
                }
                case $permission == Permission::ACCESS :
                {
                    array_push($permissions_name, [Permission::ACCESS => 'Доступ к сайту']);
                    break;
                }
                case $permission == Permission::MANAGE_ITEMS :
                {
                    array_push($permissions_name, [Permission::MANAGE_ITEMS => 'Модератор']);
                    break;
                }
                case $permission == Permission::GOVERNANCE :
                {
                    array_push($permissions_name, [Permission::GOVERNANCE =>'Член Правления ТСН']);
                    break;
                }
            }
        }

        $permissions_name = Arr::sortRecursive($permissions_name);
        $positions = Position::all();
        return view('users.addOrUpdate', ['permissions' => $permissions_name, 'update'=> isset($request->user_update)? User::find($request->user_update) : false, 'positions' => $positions ]);
    }
    public function addOrUpdate(Request $request){
        $request->flash();
        $inputs = $request->input();
        $rules = [];
        foreach ($inputs as $key => $input){
            switch ($key){
                case 'id' :
                {
                    $rules[$key] = 'required|numeric|exists:users,id';
                    break;
                }
                case ('name') :
                {
                    $rules[$key] = 'required';
                    break;
                }
                case ('address') :
                {
                    $rules[$key] = 'required';
                    break;
                }
                case 'phone' :
                {
                    $rules[$key] = 'required|numeric|digits:10|unique:users,phone';
                    break;
                }
                case 'email-address' :
                {
                    $rules[$key] = 'nullable|email:rfc|unique:users,email';
                    break;
                }
                case 'position' :
                {
                    $rules[$key] = 'nullable';
                    break;
                }
                case 'password' :
                {
                    if(isset($inputs['password'])) {
                        $rules[$key] = 'required';
                    }
                    break;
                }
                case 'permission' :
                {
                    $rules[$key] = 'required';
                    break;
                }
            }
        }
        if(!isset($inputs['password'])) {
            $rules['password'] = 'nullable';
        }
        if(!isset($inputs['id'])) {
            $rules['id'] = 'nullable';
        }else{
            $rules['phone'] = 'required|numeric|digits:10';
            $rules['email-address' ] = 'nullable|email:rfc';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return redirect('manage/add')
                ->withErrors($validator)
                ->withInput();
        }

        $parameters = $this->validate( $request, $rules);
        if (!in_array("governance", $parameters['permission'])) {
            $parameters['position'] = null;
        }
        if (in_array("governance", $parameters['permission'])) {
            if(isset($parameters['position'])){
                $users = User::all();
                foreach ($users as $user) {
                    if ($user->position_id == $parameters['position']){
                        //Permission::GOVERNANCE
                        $arr_user_permitions = explode(',', $user->permissions);
                        unset($arr_user_permitions[array_search(Permission::GOVERNANCE,$arr_user_permitions)]);
                        $arr_user_permitions = implode(',', $arr_user_permitions);

                        $user->update([
                            'position_id' => null,
                            'permissions' => $arr_user_permitions
                        ]);
                    }
                }
            }
        }

        if (isset($parameters['password'])){
            $password = Hash::make($parameters['password']);
        }elseif(isset($request->id)){
            $password = User::find($request->id)->password;
        }

        if (!isset($request->id)) {
            $user = User::updateOrCreate(
                [ 'phone' => $parameters['phone'], 'email' => $parameters['email-address']],
                [
                    'name' => $parameters['name'],
                    'address' => $parameters['address'],
                    'position_id' => $parameters['position'],
                    'password' => Hash::make($parameters['password']),
                    'permissions' => implode(',', $parameters['permission']),
                ]
            );
        }else{
            $user = User::updateOrCreate(
                ['id'=> $request->id],
                [
                    'phone' => $parameters['phone'],
                    'email' => $parameters['email-address'],
                    'name' => $parameters['name'],
                    'address' => $parameters['address'],
                    'password' => $password,
                    'position_id' => $parameters['position'],
                    'permissions' => implode(',', $parameters['permission']),
                ]
            );
            //dd($user);
        }
        $users = User::all();
        return view('users.index',['users'=>$users]);
    }

    public function delete(Request $request){
        $user = User::find($request->user_del);
        $user->delete();
        $users = User::all();
        return view('users.index',['users'=>$users]);
    }
    public function governance(){
        $users = User::all();
        $permissions =  Permission::allPermission();
        $positions = Position::all();
        return view('users.governance',['permissions' => $permissions, 'positions' => $positions, 'users' => $users, 'error'=>'' ]);
    }
    public function governanceManage(Request $request){
        $request->flash();
        $inputs = $request->input();
        $array_count_values = array_count_values($inputs);
        $error = '';
        foreach ($array_count_values as $key => $count_value) {
            if ($count_value > 1){
                $user = User::find($key);
                if ( isset( $user->position_id ) ) {
                    $error = 'Пользователь ' . User::find($key)->name . ' не может занимать должность ' . Position::find($count_value)->position . ', т.к. он уже занимает должность ' . Position::find(User::find($key)->position_id)->position . '!';
                }else{
                    $error = 'Пользователь ' . User::find($key)->name . ' не может занимать несколько должностей сразу!';
                }
            }
        }
        if(!$error){
            foreach ($inputs as $position_id => $user_id) {
                if(is_numeric($position_id)){
                    //dd($user_id);
                    $users = User::all();
                    foreach ($users as $user){
                        if ($user->position_id == $position_id){
                            $user->update([
                                'position_id' => null,
                            ]);
                        }
                    }
                    $user = User::find($user_id);
                    $user->update([
                        'position_id' => $position_id,
                    ]);
                }
            }
        }
        $users = User::all();
        $permissions =  Permission::allPermission();
        $positions = Position::all();
        return view('users.governance',['permissions' => $permissions, 'positions' => $positions, 'users' => $users, 'error' => $error ]);
    }
}
