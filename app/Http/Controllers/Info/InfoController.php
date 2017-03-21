<?php

namespace App\Http\Controllers\Info;

use App\Models\Info\Info;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class InfoController extends Controller
{
    protected $fields = [
        'id' => 'equals',
        'name' => 'equals',
        'description' => 'equals',
        //'service_id' => 'equals',
        'remark' => 'equals',
        'user_id' => 'equals',
        'customer_id' => 'equals',
        'resolve_time' => 'equals',
        'feedback' => 'equals',
        'created_at' => 'equals',
        'updated_at' => 'equals'
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //orderBy
        $orderBy = $request->get('orderBy');
        $orderBy = $orderBy[0];
        $order = strpos($orderBy, '+') === false?'desc':'asc';
        $orderBy = substr($orderBy, 1)?:'id';//排序
        
        //服务类型
        if(!$request->has('service_id')) {
            return ['status' => 0, 'msg' => '服务类型id is require'];
        }
        
        $serviceId = $request->get('service_id');

        //filter
        $filters = $request->get('filters');

        $currentPage = $request->get('currentPage')?:1; //当前页码
        $itemsPerPage = $request->get('itemsPerPage')?:15;//每页有几条数据
        $skip = ($currentPage - 1)*$itemsPerPage;
        $take = $request->get('takeCount')?:$itemsPerPage;

        $infos = Info::where('service_id', $serviceId);

        if(!empty($filters)) {
            foreach ($filters as $key => $value) {
                if ($value == '') continue;
                if ($key == 'id') {
                    $infos = $infos->where('od_orders.id', $value);
                    continue;
                }
                if(isset($this->fields[$key]) && $this->fields[$key] == 'equals')
                    $infos = $infos->where($key, $value);
                else
                    $infos = $infos->where($key, 'like', '%'.$value.'%');
            }
        }

        $data['recordsTotal'] = $infos->count();

        $data['data'] = $infos->skip($skip)
            ->take($take)
            ->orderBy($orderBy, $order)
            ->get();


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
        $info = new Info();

        foreach (array_keys($this->fields) as $field) {
            if ($request->has($field)) $info->$field = $request->get($field);
        }

        $info->save();

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
        $info = Info::find($id);

        foreach (array_keys($this->fields) as $field) {
            if($request->has($field) && $info->$field!=$request->get($field)) $info->$field = $request->get($field);
        }

        if(!$info->save()) {
            return ['status' => 0, 'msg' => '更新失败'];
        }

        return ['status' => 1, 'msg' => '更新成功'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Info::destroy($id);

        return ['status' => 1, 'msg' => 'delete success'];
    }
}
