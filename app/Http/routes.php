<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

// 认证路由...
Route::get('auth/login', 'Auth\AuthController@getLogin');
Route::post('auth/login', 'Auth\AuthController@postLogin');
Route::get('auth/logout', 'Auth\AuthController@getLogout');

// 注册路由...
Route::get('auth/register', 'Auth\AuthController@getRegister');
Route::post('auth/register', 'Auth\AuthController@postRegister');

Route::any('user/authuser', 'UserController@checkLogin');



//强制登录
Route::group(['middleware' => ['auth', 'permission']], function() {
//Route::group(['middleware' => ['auth']], function() {
//如果没有添加as(别名)，即没有添加权限规则，则默认能访问该路由
    //User 路由
    Route::get('user/getUserOptional', ['uses' => 'Manager\UserController@getUserOptional']);//所有用户名字及其部门信息
    Route::get('user/getProfile', ['as' => 'user.getProfile', 'uses' => 'Manager\UserController@checkLogin']);
    Route::post('user/profileUpdate', ['as' => 'user.profileUpdate', 'uses' => 'Manager\UserController@selfUpdate']);
    //某个用户拥有的的所有权限（部门+个人）
    Route::post('user/allPermissionsHad', ['uses' => 'Manager\UserController@allPermissionshad']);
    Route::resource('user', 'Manager\UserController', ['names' => ['update' => 'user.edit', 'store' => 'user.create']]);


    //leave 请假
    Route::get('leave/monthLeaves/{currentMonth}', ['as' => 'leave.monthLeaves', 'uses' => 'Manager\LeaveController@monthLeaves']);
    Route::resource('leave', 'Manager\LeaveController');

    //group 路由
    Route::get('group/aGroupPermissions/{id}', ['uses' => 'Manager\GroupController@oneGroupPermission']);
    Route::get('group/index', ['as' => 'group.index', 'uses' => 'Manager\GroupController@index']);
    Route::get('/group/getUsers/{id}', ['uses' => 'Manager\GroupController@getUsersByGroup']);//部门下的所有员工
    Route::post('group/index', ['as' => 'group.index', 'uses' => 'Manager\GroupController@index']);
    Route::resource('group', 'Manager\GroupController', ['names' => ['update' => 'group.edit', 'store' => 'group.create']]);

    //permission
    // Route::get('permission/manage', ['as' => 'permission.manage', 'uses' => 'PermissionController@index']);
    //Route::get('permission/{cid?}', ['as' => 'permission.index', 'uses' => 'PermissionController@index']);
    Route::post('permission/index', ['as' => 'permission.index', 'uses' => 'Manager\PermissionController@index']); //查询
    Route::resource('permission', 'Manager\PermissionController');

    //post
    Route::get('post/index', ['uses' => 'Manager\PostController@allPost']);//
    Route::resource('post', 'Manager\PostController', ['names' => ['update' => 'post.edit', 'store' => 'post.create']]);

    //服务类型
    Route::post('service/index', ['as' => 'service.index', 'uses' => 'Info\ServiceController@index']);
    Route::resource('service', 'Info\ServiceController', ['names' => ['update' => 'service.edit', 'store' => 'service.create']]);

    //服务信息统一的增删改查
    Route::post('info/index', ['as' => 'info.index', 'uses' => 'Info\InfoController@index']);
    Route::resource('info', 'Info\InfoController', ['names' => ['update' => 'info.edit', 'store' => 'info.create']]);
    });

Route::get('/', ['middleware' => 'auth', function () {
    return view('index');
}]);
Route::get('home', function () {
    return view('index');
});
Route::get('/unsupported-browser', function () {
    return view('unsupported_browser');
});

Route::any('addorder/index', ['uses' => 'Order\AddOrderController@index']);