<?php

namespace App\Http\Controllers\Manager;

use App\Models\Manager\Group;
use App\User;
use Illuminate\Http\Request;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //user所拥有的属性
    protected $fields = [
        'name' => '',
        'email' => '',
        'sex' => '',
        'phone' => '',
        'identity' => '',
        'groups' => []
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data['recordsFiltered'] = User::count();
        $data['data'] = User::with('groups')->get();
        return ['status' => 1, 'data' => $data];
    }

    /**
     * Store a newly created resource in storage.
     * user save
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if(User::where('email', '=', $request->get('email'))->first()) {
            return ['status' => 0, 'msg' => '邮箱已经存在'];
        }

        $user = new User();
        foreach (array_keys($this->fields) as $field) {
            $user->$field = $request->get($field);
        }
        $user->password = bcrypt($request->get('password'));
        unset($user->groups);
        unset($user->permissions);

        $user->save();

        //用户部门，暂时弃用
        /*if (is_array($request->get('groups'))) {
            $user->giveGroupTo($request->get('groups'));
        }*/

        $groupId = $request->get('groupId');

        //注入单个部门
        if(is_numeric($request->get('groupId'))) {
            $group = Group::find($groupId);
            $user->assignGroup($group);
        }

        $allPermissions = $request->get('permissions');

        //个人权限
        if(is_array($allPermissions) && isset($allPermissions[0])) {
            $permissions = $this->filterPermission($allPermissions, $groupId);
            //注入个人权限
            $user->givePermissionTo($permissions);
        }
        
        //监听？
        //event();
        return ['status' => '1', 'msg' => '添加成功'];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::find((int)$id);
        if(!$user) {
            return ['status' => 0, 'msg' => 'user not exist'];
        }
        foreach (array_keys($this->fields) as $field) {
            $user->$field = $request->get($field);
        }

        //password
        if ($request->get('password') != '') {
            $user->password = bcrypt($request->get('password'));
        }


        //清空部门
        unset($user->groups);
        //清空权限
        unset($user->permissions);

        $user->save();
        
        $groupId = $request->get('groupId');

        //注入单个部门
        if(!empty($request->get('groupId'))) {
            $user->giveGroupTo([$groupId]);
        }


        $allPermissions = $request->get('permissions');

        //个人权限
        if(is_array($allPermissions) && isset($allPermissions[0])) {
            $permissions = $this->filterPermission($allPermissions, $groupId);
            //注入个人权限
            $user->givePermissionTo($permissions);
        }

        return ['status' => 1, 'msg' => 'update success'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return array
     */
    public function destroy($id)
    {
        $user = User::find((int)$id);
        if ($user && $user->id != 1 && $user->id != 2) {
            //id 为1 设置成超级管理员, 2 是 boss

            //解绑group user
            foreach ($user->groups as $v){
                $user->groups()->detach($v);
            }

            //解绑 permission
            foreach ($user->permissions as $v){
                $user->permissions()->detach($v);
            }

            $user->delete();
        } else {
            return ['status' => 0, 'msg' => '删除失败'];
        }

        return ['status' => 1, 'msg' => 'deleted'];
    }

    /**
     * 登陆用户login状态检查
     * 如果已经登录，返回用户信息
     *
     * @return array
     */
    public function checkLogin()
    {
        if (Auth::check()) {
            //已登录、记住我
            $user = Auth::user();
            //dd($user);
            //dd($user->groups);
            foreach($user->groups as $group) {

                //部门对应主管信息
                $supervisor = User::find($group['supervisor_id']);
                $group->supervisor = $supervisor;
            }
            $data['user'] = $user;

            //所有部门
            //$data['groupsAll'] = Group::all()->toArray();

            return ['status' => 1, 'data' => $data];
        } else {
            return ['status' => 0, 'msg' => 'login required'];
        }

    }


    /**
     * 修改个人资料
     * @param Request $request
     * @return array
     */
    public function selfUpdate(Request $request) {
        $user = User::find((int)$request->get('id'));
        if(!$user) {
            return ['status' => 0, 'msg' => 'user not exist'];
        }

        if(!Auth::check() || $request->get('id') != Auth::user()->id) {
            return ['status' => 0, 'msg' => 'Permission denied'];
        }

        if($request->get('email')) $user->email = $request->get('email');
        if($request->get('password')) $user->password = bcrypt($request->get('password'));
        if($request->get('qq')) $user->qq = $request->get('qq');
        if($request->get('phone')) $user->phone = $request->get('phone');
        if($request->get('domicile')) $user->domicile = $request->get('domicile');
        if($request->get('graduated_school')) $user->graduated_school = $request->get('graduated_school');
        if($request->get('address')) $user->address = $request->get('address');
        if($request->get('sex')) $user->sex = $request->get('sex');
        if($request->get('remark')) $user->remark = $request->get('remark');

        if($user->save()) {
            if($request->get('email') || $request->get('password'))
            {
                Auth::login($user);
            }
            return ['status' => 1, 'msg' => 'success'];
        }

        return ['status' => 0, 'msg' => 'failed'];

    }

    /**
     * 筛选出个人权限
     * @param $allPermissions
     * @param $groupId
     * @return array
     */
    public function filterPermission($allPermissions, $groupId)
    {
        $permissions = [];
        $groupPermissions = Group::find($groupId)->permissions->keyBy('id');
        foreach($allPermissions as $p) {
            //所有权限中有，组没有，加入个人权限
            if(empty($groupPermissions[$p])) {
                $permissions[] = $p;
            }
        }
        foreach($groupPermissions as $key => $value) {
            //组有，所有权限中没有，加入个人权限。++ = -
            if(!in_array($key,$allPermissions)) {
                $permissions[] = $key;
            }
        }

        return $permissions;
    }


    /**
     * 某个员工拥有的所有权限
     * @param Request $request
     * @return array
     */
    public function allPermissionshad (Request $request)
    {
        $userId = $request->get('id')?:Auth::user()->id;
        $groupId = $request->get('groupId');

        if(!$userId || !$groupId) return ['status' => 0, 'msg' => 'id and groupId required'];

        $groupPermissions = Group::where('id', '=', $groupId)->first()->permissions->keyBy('id');
        $personPermissions = User::where('id', '=', $userId)->first()->permissions->keyBy('id');

        $allPermissionHad = [];
        $allPermissionNameHad = [];

        //++ = -  个人权限 + 部门权限
        foreach($groupPermissions as $groupPermission) {
            if(empty($personPermissions[$groupPermission->id])) {
                $allPermissionHad[] = $groupPermission->id;
                $allPermissionNameHad[] = $groupPermission->name;
            }
        }
        foreach($personPermissions as $personPermission) {
            if(empty($groupPermissions[$personPermission->id])) {
                $allPermissionHad[] = $personPermission->id;
                $allPermissionNameHad[] = $personPermission->name;
            }
        }

        $data['allPermissionHad'] = $allPermissionHad;
        $data['allPermissionNameHad'] = $allPermissionNameHad;

        return ['status' => 1, 'data' => $data];
    }
    
    /**
     * user 的可选常用项 'users.id', 'users.name', 'groupId', 'groupName', 'supervisorId'
     * @return array
     */
    public function getUserOptional()
    {
        $data['data'] = User::with(['groups' => function($query){
            $query->select('groups.id', 'groups.name', 'groups.supervisor_id');
        }])
            ->select('users.id', 'users.name')
            ->get();
        foreach ($data['data'] as $user) {
            if (isset($user->groups[0])) {
                $user->groupId = $user->groups[0]->id;
                $user->groupName = $user->groups[0]->name;
                $user->supervisorId = $user->groups[0]->supervisor_id;
            }
            unset($user->groups);
        }
        $data['recordsTotal'] = User::count();
        return ['status' => 1, 'data' => $data];
    }
}
