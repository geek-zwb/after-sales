<?php

namespace App\Models\Manager;

use Illuminate\Database\Eloquent\Model;

class Leave extends Model
{
	/**
	 * 一张请假条对应一个用户
	 * @return \Illuminate\Database\Eloquent\Relations\HasOne
	 */
    public function user() {
	    return $this->belongsTo('App\User','user_id','id');
    }

	/**
	 * 主管
	 * @return \Illuminate\Database\Eloquent\Relations\HasOne
	 */
	public function supervisor() {
		return $this->belongsTo('App\User','supervisor_id','id');
	}
}
