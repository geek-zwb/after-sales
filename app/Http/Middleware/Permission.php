<?php

namespace App\Http\Middleware;

use Closure;

class Permission
{
    protected $except = [
        '/',
        'home'
    ];
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $permit = $this->getPermission($request);

        if($permit == 'undefined') {
            //没有定义该权限，跳过权限检查
            return $next($request);
        }

        if($permit == '*') {
            //* 跳过权限检查
            return $next($request);
        }

        //当前账户
        $user = \Auth::user();

        if($user->id == 1 || $user->id == 2) {
            //1 超级管理员 2 boss 跳过权限检查
            return $next($request);
        }

        if ($user->hasPermission($permit)) {
            return $next($request);
        }

        return ['status' => 0, 'msg' => 'permission denied'];
    }

    /**
     * 获取当前路由需要的权限
     * @param $request
     * @return mixed
     */
    public function getPermission($request)
    {
        $actions = $request->route()->getAction();
        //这里要不要对没有设置权限的路由进行处理呢？？？
        if(empty($actions['as'])) {
            return 'undefined';
        }
        return $actions['as'];
    }
}
