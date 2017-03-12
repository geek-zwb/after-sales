<?php

namespace App\Http\Controllers\Manager;

use App\Models\Manager\Leave;
use App\User;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class LeaveController extends Controller
{
    protected $fields = [
      'user_id' => '',
      'type' => '',
      'leave_reson' => '',
      'begin' => '',
      'end' => '',
      'supervisor_id' => '',
      'total_time' => '',
      //'grant' => '',
      //'grant_time' => ''
    ];

    /**
     * Display a listing of the resource.
     * 当月请假人次，详情
     * 先个人，即默认只能查询自身
     * @return \Illuminate\Http\Response
     */
    public function indexold(Request $request)
    {
        $data = [];
        $start = $request->get('start');
        $length = $request->get('length')?:15;//每页取几条
        $search = $request->get('search');//搜索
        $order = $request->get('order');//升序与降序
        $columns = $request->get('columns');
        $data['recordsTotal'] = Leave::count();

        if (strlen($search['value']) > 0) {
            $data['recordsFiltered'] = Leave::where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search['value'] . '%')
                      ->orWhere('email', 'like', '%' . $search['value'] . '%');
            })
                ->where('user_id', '=', Auth::User()->id)
                ->count();

            $data['data'] = Leave::where(function ($query) use ($search) {
                $query->where('name', 'LIKE', '%' . $search['value'] . '%')
                    ->orWhere('email', 'like', '%' . $search['value'] . '%');
            })
                ->where('user_id', '=', Auth::User()->id)
                ->skip($start)->take($length)
                //->orderBy($columns[$order[0]['column']]['data'], $order[0]['dir'])
                ->get()->keyBy('id');
        } else {
            $data['recordsFiltered'] = Leave::count();
            $data['data'] = Leave::skip($start)
                ->take($length)
               // ->orderBy($columns[$order[0]['column']]['data'], $order[0]['dir'])
                ->get()->keyBy('id');
        }

        //$data = response()->json($data);

        return ['status' => 1, 'data' => $data];
    }

    public function index()
    {
        $data['data'] = Leave::where('user_id', '=', Auth::User()->id)
            ->with('supervisor')
            ->orderBy('created_at', 'desc')
            ->get();
                // ->orderBy($columns[$order[0]['column']]['data'], $order[0]['dir'])

        //$data = response()->json($data);
        $data['recordsTotal'] = Leave::where('user_id', '=', Auth::User()->id)->count();

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
       // $hasLeave = Leave::where('end', '>', $request->get('end'))->where('begin', '<', $request->get('begin'));
        //if($hasLeave) return ['status' => 0, 'msg' => '重复请假'];

        $leave = new Leave();
        foreach(array_keys($this->fields) as $field) {
            if(!$request->get($field)) {
                return ['status' => '0', 'msg' => $field.' is required'];
            }
            $leave->$field = $request->get($field);
        }

        if(!$leave->save()) {
            return ['status' => 0, 'msg' => '添加失败'];
        }

        return ['status' => 1, 'msg' => '添加成功'];
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
        $leave = Leave::find((int)$id);

        if(!$leave) return ['status' => 0, 'msg' => '请假条不存在'];

        //在审批成功前可以进行修改
        if($leave->grant != 2) {
            //当前用户自身修改
            foreach (array_keys($this->fields) as $field) {
                if(!$request->get($field)) {
                    return ['status' => '0', 'msg' => $field.' is required'];
                }
                $leave->$field = $request->get($field);
            }

            //主管审批
            if(Auth::User()->id == $leave->supervisor_id || Auth::User()->id == 1) {
                if($request->get('grant')) $leave->grant = $request->get('grant');
                if($request->get('grant_info')) $leave->grant_info = $request->get('grant_info');
            }

        } else {
            //已经审批成功，只有管理员修改？
            if(Auth::User()->id != 1) {
                return ['status' => '0', 'msg' => ' permission denied'];
            }
            foreach (array_keys($this->fields) as $field) {
                if(!$request->get($field)) {
                    return ['status' => '0', 'msg' => $field.' is required'];
                }
                $leave->$field = $request->get($field);
            }
            if($request->get('grant')) $leave->grant = $request->get('grant');
            if($request->get('grant_info')) $leave->grant_info = $request->get('grant_info');
        }

        //更新
        if(!$leave->save()) return ['status' => 0, '修改失败'];

        return ['status' => 1, 'msg' => '修改成功'];

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $leave = Leave::find((int)$id);

        if(!$leave) {
            if(!$leave) return ['status' => 0, 'msg' => '请假条不存在'];
        }
        if($leave->grant != 2) {
            $leave->delete();
        } else {
            //主管和超级管理员
            if(Auth::User()->id != 1 || Auth::User()->id != $leave->supervisor_id) {
                return ['status' => '0', 'msg' => ' permission denied'];
            }
            $leave->delete();
        }

        return ['status' => 1, 'msg' => '删除成功'];
    }

    public function test()
    {
        $data['data'] = Leave::where('user_id', '=', Auth::User()->id)
            ->with('supervisor')
            ->orderBy('created_at', 'desc')
            ->get();
        // ->orderBy($columns[$order[0]['column']]['data'], $order[0]['dir'])

        //$data = response()->json($data);
        $data['recordsTotal'] = Leave::where('user_id', '=', Auth::User()->id)->count();

        return ['status' => 1, 'data' => $data];
    }


    /**
     * 查询月份的所有员工请假记录
     * @param $currentMonth
     * @return array
     */
    public function monthLeaves($currentMonth)
    {
        User::lists('name', 'identity');
        $data = User::select('users.id', 'users.name', 'leaves.*')
            ->join('leaves', 'users.id', '=', 'leaves.user_id')
           // ->with('leaves')
            ->where('begin', 'like', '%'.$currentMonth.'%')
            ->orWhere('end', 'like', '%'.$currentMonth.'%')
            ->orWhere(function ($query) use ($currentMonth) {
                $query->where('begin', '<', $currentMonth)
                    ->where('end', '>', $currentMonth);
            })
            ->get();

        return ['status' => 1, 'data' => $data];
    }
}
