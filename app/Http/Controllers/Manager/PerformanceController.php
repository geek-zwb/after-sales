<?php

namespace App\Http\Controllers\Manager;

use App\Models\Manager\Performance;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class PerformanceController extends Controller
{
    protected $fields = [
        // 'user_id' => '',
        ///'day_time' => '',
        //'what_day' => '',
        'day_work' => '',
        'self_rating' => '',
        'efficiency_rating' => '',
        'quality_rating' => '',
        'overall_rating' => '',
        'remark' => '',
        'week_target' => '',
        'week_completed_target' => ''
    ];

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if(!$request->get('userId')) return ['status' => 0, 'msg' => 'user_id is required'];

        $userId = $request->get('userId');
        $currentMonth = $request->get('currentMonth');

       $total = Performance::where('user_id', $userId)
            ->where('day_time', 'like', '%'.$currentMonth.'%')
            ->count();

        if($total == 0) {
            $this->createPerformances($userId, $currentMonth);
        }

        $data = Performance::where('user_id', $userId)
            ->where('day_time', 'like', '%'.$currentMonth.'%')
            ->get()->keyBy('id');

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
        $performance = Performance::find($id);

        foreach (array_keys($this->fields) as $field) {
            if($request->get($field) && $performance->$field!=$request->get($field)) $performance->$field = $request->get($field);
        }

       // $performance->update();
        if(!$performance->save()) {
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
        //
    }


    /**
     * 生成当月的全部
     * @param $currentMonth
     */
    public function createPerformances($userId, $currentMonth)
    {
        //$currentMonth = $request->get('currentMonth');// Y-m
        //$firstDay = date('Y-m-01', strtotime(date("Y-m-d")));
        $firstDay = $currentMonth.'-01';
        $totalDay = date('t',strtotime($firstDay));//current month total days

        $whatDayChinese = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];

        $whatDay = date("N",strtotime($firstDay));
        for ($i = 1; $i <= $totalDay; $i++) {
            $performance = new Performance();
            $performance->user_id = $userId;

            $currentDay = $currentMonth.'-'.$i;
            $performance->day_time = $currentDay;//
            $performance->what_day = $whatDayChinese[$whatDay-1];//
            $performance->save();

            if($whatDay == 7) {
                //本周目标及完成情况
                $performance = new Performance();
                $weekBegin = date('Y-m-d', strtotime("$currentDay -6 days"));
                $performance->user_id = $userId;
                $performance->day_time = $currentDay;
                $performance->week_target = "$weekBegin to $currentDay 本周工作基础目标计划(个人与主管协商):";//周一到周天
                $performance->week_completed_target = "本周实际完成盘点:";
                $performance->save();
            }

            $whatDay = $whatDay == 7 ? 1 : $whatDay+1;
        }
    }
}
