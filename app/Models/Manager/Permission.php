<?php

namespace App\Models\Manager;

use App\User;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
	/**
	 * group <=> permission 多对多
	 *
	 * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
	 */
	public function groups()
	{
		return $this->belongsToMany(Group::class,'group_permission','permission_id','group_id');
	}

	/**
	 * 用户与权限
	 * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
	 */
	public function users()
	{
		return $this->belongsToMany(User::class, 'permission_user', 'permission_id', 'user_id');
	}
}
