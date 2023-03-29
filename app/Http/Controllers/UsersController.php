<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Permission;
use App\Models\Position;
use App\Models\Quorum;
use App\Models\User;
use App\Models\UsersAdditionalFields;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    protected function companyUsers(){
        $companies = Company::all();
        $company_users = [];
        $users_db = DB::table('users')
            ->whereNotIn('id',
                DB::table('users')
                    ->join('company_user', 'users.id', '=', 'company_user.user_id')
                    ->join('companies', 'companies.id', '=', 'company_user.company_id')
                    ->select('users.id'))
            ->select('users.*')
            ->get();
        $arr_users = [];
        foreach($users_db as $user_db){
            $arr_users[] = User::find($user_db->id);
        }
        $company_users[0] = $this->prepareUsersForReact($arr_users);
        foreach ($companies as $company){
            if($company->users()->get()->count() > 0) {
                $company_users[$company->id] = $this->prepareUsersForReact($company->users()->get());
            }else{
                $company_users[$company->id] = [];
            }
        }
        // dd($company_users);
        return $company_users;
    }
    protected function prepareUsersForReact($users){
        $cnt = 0;
        $index = 0;
        $users_new = [];
        foreach ($users as $user_prepare){
            $users_new[$index]['num'] = $cnt++;
            $users_new[$index]['id'] = $user_prepare->id;
            $users_new[$index]['name'] = $user_prepare->name;
            $users_new[$index]['address'] = $user_prepare->address;
            $users_new[$index]['phone'] = $user_prepare->phone;
            $users_new[$index]['email'] = $user_prepare->email;
            $users_new[$index]['position'] = $user_prepare->position();
            $users_new[$index]['permissions'] = '';
            $users_new[$index]['permissions'] = $user_prepare->isAdmin() ? 'Администратор': '' ;

            if(empty($users_new[$index]['permissions'])){
                $users_new[$index]['permissions'] .= $user_prepare->isVote() ? "Допущен к голосованию": "";
            }else{
                $users_new[$index]['permissions'] .= $user_prepare->isVote() ? "=Допущен к голосованию": "";
            }
            if(empty($users_new[$index]['permissions'])){
                $users_new[$index]['permissions'] .= $user_prepare->isGovernance() ? "Член правления": "";
            }else{
                $users_new[$index]['permissions'] .= $user_prepare->isGovernance() ? "=Член правления": "";
            }
            if(empty($users_new[$index]['permissions'])){
                $users_new[$index]['permissions'] .= $user_prepare->isManageItems() ? "Модератор": "";
            }else{
                $users_new[$index]['permissions'] .= $user_prepare->isManageItems() ? "=Модератор": "";
            }
            if(empty($users_new[$index]['permissions'])){
                $users_new[$index]['permissions'] .= $user_prepare->isAccess() ? "Допущен к сайту": "";
            }else{
                $users_new[$index]['permissions'] .= $user_prepare->isAccess() ? "=Допущен к сайту": "";
            }
            if(empty($users_new[$index]['permissions'])){
                $users_new[$index]['permissions'] .= $user_prepare->isSuperAdmin() ? "Супер Администратор": "";
            }else{
                $users_new[$index]['permissions'] .= $user_prepare->isSuperAdmin() ? "=Супер Администратор": "";
            }
            $users_new[$index]['company_id'] = $user_prepare->company_id;

            $index++;
        }
        // Сортируем массив $data сначала по volume, затем по edition
        $users_new = $this->array_orderby($users_new, 'address', SORT_ASC);


        $index = 0;
        foreach ($users_new as $user){
            $users_new[$index]['permissions'] = explode('=',$users_new[$index]['permissions']);
            $index++;
        }

        return $users_new;
    }

    // создадим функцию которая нам поможет в сортировке массивов
    protected function array_orderby()
    {
        $args = func_get_args();
        $data = array_shift($args);
        foreach ($args as $n => $field) {
            if (is_string($field)) {
                $tmp = array();
                foreach ($data as $key => $row)
                    $tmp[$key] = $row[$field];
                $args[$n] = $tmp;
            }
        }
        $args[] = &$data;
        call_user_func_array('array_multisort', $args);
        return array_pop($args);
    }


    public function index(){
        if (!auth()->user()->isSuperAdmin()){
            if(!session('current_company')){
                return redirect()->route('polls.index');
            }
            $users = Company::find(session('current_company')->id)->users()->get();
        }else{
            $users = User::all();
        }
        $users_new = $this->prepareUsersForReact($users);
        $hash_company_users = $this->companyUsers();
        $companies = Company::all();
        $companies->push(['id'=>0,'title'=>'Не закрепленные']);
        //dd($companies);
        \JavaScript::put([
            'users' => $users_new,
            'csrf_token' =>  csrf_token(),
            'companies' => $companies,
            'hash_company_users' => $hash_company_users,
            'current_company' => session('current_company'),
            'isSuperAdmin' => auth()->user()->isSuperAdmin() ? true : false,
        ]);

        return view('users.index',['users' => $users_new]);
    }

    public function indexProfile(){
        return view('users.profile',['user'=> auth()->user() ? auth()->user() : false, 'update' => false]);
    }

    public function updateProfile(){
        return view('users.profile',['user'=> auth()->user() ? auth()->user() : false, 'update' => true]);
    }

    public function submitUpdateProfile(Request $request){
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
                case 'ownership' :
                {
                    $rules[$key] = 'nullable';
                    break;
                }
                case 'company' :
                {
                    $rules[$key] = 'required';
                    break;
                }
                case 'password' :
                {
                    if(isset($inputs['password'])) {
                        $rules[$key] = 'required';
                    }
                    break;
                }
                case 'job' :
                {
                    $rules[$key] = 'nullable';
                    break;
                }
            }
        }
        if(!isset($inputs['password'])) {
            $rules['password'] = 'nullable';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return redirect()->route('users.profile.update')
                ->withErrors($validator)
                ->withInput();
        }

        $parameters = $this->validate( $request, $rules);
        if (isset($parameters['password'])){
            $password = Hash::make($parameters['password']);
        }

        $user = isset($parameters['id']) ? User::find($parameters['id']):'';

        $user_additionals = UsersAdditionalFields::updateOrCreate(
            ['id'=> $user->additional_id],
            [
                'job' => isset($parameters['job']) ? $parameters['job'] : '',
                'ownership' => isset($parameters['ownership']) ? $parameters['ownership'] : ''
            ]
        );

        if (auth()->user()->isSuperAdmin()){
            $user->update(
                [
                    'company_id' => $parameters['company']
                ]
            );
        }

        $user->update(
            [
                'name' => $parameters['name'],
                'address' => $parameters['address'],
                'email' => $parameters['email-address'],
                'additional_id' => isset($user_additionals) ? $user_additionals->id : null
            ]
        );

        if (isset($password)) {
            $user->update(
                [
                    'password' => $password
                ]
            );
        }

        return view('users.profile',['user'=> $user, 'update' => false]);
    }

    public function addOrUpdateForm(Request $request){
        if(!session('current_company')){
            return redirect()->route('polls.index');
        }
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
                    array_push($permissions_name, [Permission::VOTE => 'Допущен к голосованию']);
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
        $positions = Position::where('company_id',session('current_company')->id)->get();
        return view('users.addOrUpdate', [
                                                'permissions' => $permissions_name,
                                                'update'=> isset($request->user_update)? User::find($request->user_update) : false,
                                                'positions' => $positions,
                                                'companies' => Company::all()
                                                ]);
    }

    public function addOrUpdate(Request $request){
        if(!session('current_company')){
            return redirect()->route('polls.index');
        }
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
                case 'ownership' :
                {
                    $rules[$key] = 'nullable';
                    break;
                }
                case 'companies' :
                {
                    $rules[$key] = 'required';
                    break;
                }
                case 'job' :
                {
                    $rules[$key] = 'nullable';
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
//        dd($parameters);

//        if (isset($parameters['companies'])){
//            $company_from_form = Company::find($parameters['companies']);
//            if ( (session('current_company')->id != $company_from_form->id) && (!auth()->user()->isSuperAdmin()) ){
//                return redirect('manage/add')
//                    ->withErrors('Не достаточно прав на операцию!')
//                    ->withInput();
//            }
//        }


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

        if(isset($parameters['job']) || isset($parameters['ownership']) ){
            $user_additionals = UsersAdditionalFields::updateOrCreate(
                ['id' => isset($request->id) ? User::find($request->id)->additional_id : ''],
                [
                    'job' => isset($parameters['job']) ? $parameters['job'] : '',
                    'ownership' => isset($parameters['ownership']) ? $parameters['ownership'] : ''
                ]
            );
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
                    'additional_id' => isset($user_additionals) ? $user_additionals->id : null
                    //'company_id' => session('current_company')->id
                ]
            );
            foreach ($parameters['companies'] as $company){
                Company::find($company->id)->users()->save($user);
            }
            $this->refreshQuorums();
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
                    'additional_id' => isset($user_additionals) ? $user_additionals->id : null
                    //'company_id' => session('current_company')->id
                ]
            );
            //dd($user->companies() );
            foreach ($user->companies()->get() as $company){
                $company->users()->detach([$company->id => ['user_id' => $user->id] ]);
            }
            foreach ($parameters['companies'] as $company_id){
                Company::find($company_id)->users()->attach([$user->id => ['company_id' => $company_id] ]);
            }
            $this->refreshQuorums();

        }


        if (!auth()->user()->isSuperAdmin()){
            if(!session('current_company')){
                return redirect()->route('polls.index');
            }
            $users = Company::find(session('current_company')->id)->users()->get();
        }else{
            $users = User::all();
        }
        $users_new = $this->prepareUsersForReact($users);
        $hash_company_users = $this->companyUsers();

        $companies = Company::all();
        $companies->push(['id'=>0,'title'=>'Не закрепленные']);

        \JavaScript::put([
            'users' => $users_new,
            'csrf_token' =>  csrf_token(),
            'companies' => $companies,
            'hash_company_users' => $hash_company_users,
            'current_company' => session('current_company'),
            'isSuperAdmin' => auth()->user()->isSuperAdmin() ? true : false,
        ]);
        return view('users.index',['users'=>$users]);
    }

    public function refreshQuorums(){
        $companies = Company::all();
        foreach ($companies as $company){
            if(Quorum::selectRaw('MAX(created_at)')->where('company_id',$company->id)->get()->count() > 0) {
                //dd($company->users()->where('permissions', '%like%', 'voter')->get());
                $quorum = Quorum::selectRaw('MAX(created_at)')->where('company_id', $company->id)->get();
                $quorum[0]->insert([
                    'all_users_that_can_vote' => $company->users()->where('permissions', 'like', '%voter%')->get()->count(),
                    'company_id' => $company->id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }else{
                $quorum = Quorum::create([
                    'all_users_that_can_vote' => $company->users()->where('permissions', 'like', '%voter%')->get()->count(),
                    'company_id' => $company->id,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }

    public function delete(Request $request){
        $user = User::find($request->user_del);
        $user->delete();
        $this->refreshQuorums();
        if (!auth()->user()->isSuperAdmin()){
            if(!session('current_company')){
                return redirect()->route('polls.index');
            }
            $users = Company::find(session('current_company')->id)->users()->get();
        }else{
            $users = User::all();
        }
        $users = $this->prepareUsersForReact($users);
        $hash_company_users = $this->companyUsers();
        \JavaScript::put([
            'users' => $users,
            'csrf_token' =>  csrf_token(),
            'companies' => Company::all(),
            'hash_company_users' => $hash_company_users,
            'current_company' => session('current_company'),
            'isSuperAdmin' => auth()->user()->isSuperAdmin() ? true : false,
        ]);
        return view('users.index',['users'=>$users]);
    }

    public function governance(){
        //$users = User::all();
        if(!session('current_company')){
            return redirect()->route('polls.index');
        }
        $users = Company::find(session('current_company')->id)->users()->get();
        $permissions =  Permission::allPermission();
        //$positions = Position::all();
        $positions = Position::where('company_id',session('current_company')->id)->get();
        return view('users.governance',['permissions' => $permissions, 'positions' => $positions, 'users' => $users, 'error'=>'' ]);
    }

    public function governanceManage(Request $request){
        if(!session('current_company')){
            return redirect()->route('polls.index');
        }
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
                    //$users = User::all();
                    $users = Company::find(session('current_company')->id)->users()->get();
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
        //$users = User::all();
        $users = Company::find(session('current_company')->id)->users()->get();
        $permissions =  Permission::allPermission();
        //$positions = Position::all();
        $positions = Position::where('company_id',session('current_company')->id)->get();

        return view('users.governance',['permissions' => $permissions, 'positions' => $positions, 'users' => $users, 'error' => $error ]);
    }
}
