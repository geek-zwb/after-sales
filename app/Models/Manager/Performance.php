<?php

namespace App\Models\Manager;

use Illuminate\Database\Eloquent\Model;

/**
 * 绩效表
 * Class Performance
 * @package App
 */
class Performance extends Model
{
	/**
	 * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
	 */
    function user()
    {
	   return $this->belongsTo('App\User', 'user_id', 'id');
    }
}
