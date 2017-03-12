<?php

namespace App\Http\Controllers\Manager;

use App\Models\Manager\Permission;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PermissionController extends Controller
{
    protected $fields = [
        'name' => '',
        'label' => '',
        'description' => '',
        'cid' => 0,
        'icon' => '',
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if($request->ajax()) {
            //$searchFieldDefault = 'name'; //查询的默认字段
            $data = array();
            $start = $request->get('start'); //从第几条开始获取
            $length = $request->get('length'); //要获取接下去的几条
            $order = $request->get('order'); //排序，排序方式
            $column = $request->get('column'); //排序， 排序字段
            //$search['searchField'] = $request->get('searchField')?:$searchFieldDefault; //搜索 $filter 搜索字段。如果前端已经获取了全部记录，前端处理？
            $search['searchValue'] = $request->get('searchValue'); //搜索 $filter 搜索关键字。如果前端已经获取了全部记录，前端处理？

            $cid = $request->get('cid', 0);
            $data['recordsTotal'] = Permission::where('cid', '=', $cid)->count();
            if (strlen($search['searchValue']) > 0) {
                $data['recordsFiltered'] = Permission::where('cid', $cid)->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'LIKE', '%' . $search['searchValue'] . '%')
                        ->orWhere('description', 'like', '%' . $search['searchValue'] . '%')
                        ->orWhere('label', 'like', '%' . $search['searchValue'] . '%');
                })->count();
                $data['data'] = Permission::where('cid', $cid)->where(function ($query) use ($search) {
                    $query->where('name', 'LIKE', '%' . $search['searchValue'] . '%')
                        ->orWhere('description', 'like', '%' . $search['searchValue'] . '%')
                        ->orWhere('label', 'like', '%' . $search['searchValue'] . '%');
                })
                    ->skip($start)
                    ->take($length)
                    ->orderBy($column, $order)
                    ->get()->keyBy('id');
            } else {
                $data['recordsFiltered'] = Permission::where('cid', '=', $cid)->count();
                $data['data'] = Permission::where('cid', '=', $cid)
                    ->skip($start)
                    ->take($length)
                    ->orderBy($column, $order)
                    ->get()->keyBy('id');
            }
            return ['status' => 1, 'data' => $data];
        }

        //get method
        $data['recordsFiltered'] = Permission::where('cid', '=', 0)->count();

        $data['data'] = Permission::where('cid', '=', 0)->get()->keyBy('id');

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
        $permission = new Permission();
        foreach (array_keys($this->fields) as $field) {
            $permission->$field = $request->get($field,$this->fields[$field]);
        }
        $permission->save();
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
        $permission = Permission::find((int)$id);

        if(!$permission) return ['status' => 0, 'msg' => 'not exist'];
        return ['status' => 1, 'data' => $permission];
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
        $permission = Permission::find((int)$id);
        foreach (array_keys($this->fields) as $field) {
            $permission->$field = $request->get($field,$this->fields[$field]);
        }
        $permission->save();
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
        $child = Permission::where('cid', '=', $id)->first();
        if ($child) {
            return ['status' => 0, 'msg' => "请先将该权限的子权限删除后再做删除操作!"];
        }

        $tag = Permission::find((int)$id);
        foreach ($tag->groups as $v){
            $tag->groups()->detach($v->id);
        }
        foreach ($tag->users as $v){
            $tag->users()->detach($v->id);
        }

        if($tag) {
            $tag->delete();
        } else {
            return ['status' => 0, 'msg' => 'delete failed'];
        }
        return ['status' => 1, 'msg' => 'delete success'];
    }
}
