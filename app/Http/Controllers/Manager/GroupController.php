<?php

namespace App\Http\Controllers\Manager;

use App\Models\Manager\Group;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class GroupController extends Controller
{
    protected $fields = [
        'name' => '',
        'label' => '',
        'description' => '',
        'permissions' => [],
    ];

    /**
     * Display a listing of the resource.
     * 查询全部部门信息
     *
     * @return \Illuminate\Http\Response
     */
    public function indexold(Request $request)
    {
        $searchFieldDefault = 'name'; //查询的默认字段
        $data = array();
        //$data['draw'] = $request->get('draw');
       // $count = $request->get('count')?: 15; //每页几条记录
        //$page = $request->get('page')?: 1; //当前页数
        //$start = ($page - 1)*$count; //从第几条开始获取
        $start = $request->get('start'); //从第几条开始获取
        $length = $request->get('length'); //要获取接下去的几条
        $order = $request->get('order'); //排序，排序方式
        $column = $request->get('column'); //排序， 排序字段
        $search['searchField'] = $request->get('searchField')?:$searchFieldDefault; //搜索 $filter 搜索字段。如果前端已经获取了全部记录，前端处理？
        $search['searchValue'] = $request->get('searchValue'); //搜索 $filter 搜索关键字。如果前端已经获取了全部记录，前端处理？

        $data['recordsTotal'] = Group::count();
        if (strlen($search['searchValue']) > 0) {
            //搜索
            $data['recordsFiltered'] = Role::where(function ($query) use ($search) {
                $query->where($search['searchField'], 'LIKE', '%' . $search['searchValue'] . '%')
                    ->orWhere('description', 'like', '%' . $search['searchValue'] . '%');
            })->count();
            $data['data'] = Group::where(function ($query) use ($search) {
                $query->where($search['searchField'], 'LIKE', '%' . $search['searchValue'] . '%')
                    ->orWhere('description', 'like', '%' . $search['searchValue'] . '%');
            })
                ->skip($start)->take($length)
                ->orderBy($column, $order)
                ->get();
        } else {
            //结果集
            $data['recordsFiltered'] = Group::count();
            $data['data'] = Group::skip($start)
                ->take($length)
                ->orderBy($column, $order)
                ->get();
        }
        //return response()->json($data);
        return ['status' => 1, 'data' => $data];
    }

    /**
     * 所有部门
     * @return array
     */
    public function index () {
        $data['recordsFiltered'] = Group::count();
        $data['data'] = Group::with('permissions')->get()->keyBy('id');
        return ['status' => 1, 'data' => $data];
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
        $group = new Group();
        foreach (array_keys($this->fields) as $field) {
            $group->$field = $request->get($field);
        }
        unset($group->permissions);
        // dd($request->get('permission'));
        $group->save();
        if (is_array($request->get('permissions'))) {
            $group->givePermissionsTo($request->get('permissions'));
        }

        //添加一个通知事件？

        return ['status' => 1, 'msg' => 'add success'];

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        $group = Group::find((int)$id);
        foreach (array_keys($this->fields) as $field) {
            $group->$field = $request->get($field);
        }
        unset($group->permissions);

        $group->save();

        $group->givePermissionsTo($request->get('permissions',[]));

        return ['status' => 1, 'msg' => 'update success'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $group = Group::find((int)$id);

        //解绑group user
        foreach ($group->users as $v){
            $group->users()->detach($v);
        }

        //解绑 permission
        foreach ($group->permissions as $v){
            $group->permissions()->detach($v);
        }

        if ($group) {
            $group->delete();
        } else {
            return ['status' => 0, 'msg' => '删除失败'];
        }

        return ['status' => 1, 'msg' => 'delete success'];
    }

    /**
     * 查询某一个部门的权限
     * @param $id
     * @return array
     */
    public function oneGroupPermission($id)
    {
        $data['data'] = Group::where('id', '=', $id)->first()->permissions;
        $data['recordsTotal'] = count($data['data']);
        return ['status' => 1, 'data' => $data];
    }

    /**
     * 一个部门下的所有成员
     * @param $id 部门id
     * @return array
     */
    public function getUsersByGroup($id)
    {
        $data = Group::find($id)->users;
        return ['status' => 1, 'data' => $data];
    }
}
