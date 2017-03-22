/**
 * Created by Geek-zwb on 2016/12/2 0002.
 */

"use strict";
orderApp.config([
    "$stateProvider",
    "$urlRouterProvider",
    function ($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl:'./tpl/page/home.html'
            })
            .state('user', {
                abstract: true,
                url: '/user',
                templateUrl:'./tpl/user/base.html'
            })
            .state('user.info', {
                url:'/info',
                templateUrl:'./tpl/user/index.html'
            })
            .state('user.profileUpdate', {
                url:'/profileUpdate',
                templateUrl:'./tpl/user/profileUpdate.html'
            })
            .state('manager', {
                url: '/manager',
                templateUrl: './tpl/manager/base.html',
                resolve:{
                    loadOut:["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load("managerDashboard");
                    }]
                }
            })
            .state('manager.staff', {
                abstract: true,
                template:'<div ui-view></div>'
            })
            .state('manager.staff.index', {
                url: '/index',
                templateUrl: './tpl/manager/staff/staffIndex.html',
                controller: 'StaffInfoCtrl',
                controllerAs: 'staffs'
            })
            .state('manager.staff.addStaff', {
                url: '/addStaff',
                templateUrl: './tpl/manager/staff/addStaff.html',
                controller: 'AddStaffCtrl'
            })
            .state('manager.staff.editStaff', {
                url: '/editStaff/:staffId',
                templateUrl: './tpl/manager/staff/editStaff.html',
                controller: 'EditStaffCtrl'
            })
            .state('manager.group', {
                abstract: true,
                template:'<div ui-view></div>'
            })
            .state('manager.group.index', {
                url: '/groupIndex',
                templateUrl: './tpl/manager/group/groupIndex.html',
                controller: 'GroupInfoCtrl'
            })
            .state('manager.group.addGroup', {
                url: '/addGroup',
                templateUrl: './tpl/manager/group/addGroup.html',
                controller: 'AddGroupCtrl'
            })
            .state('manager.group.editGroup', {
                url: '/editGroup/:groupId',
                templateUrl: './tpl/manager/group/editGroup.html',
                controller: 'EditGroupCtrl'
            })
            .state('manager.permission', {
                abstract: true,
                template:'<div ui-view></div>'
            })
            .state('manager.permission.index', {
                url: '/permissionIndex',
                templateUrl: './tpl/manager/permission/permissionIndex.html',
                controller: 'PermissionInfoCtrl'
            })
            .state('manager.permission.addPermission', {
                url: '/addPermission',
                templateUrl: './tpl/manager/permission/addPermission.html',
                controller: 'AddPermissionCtrl'
            })
            .state('manager.permission.editPermission', {
                url: '/editPermission/:permissionId',
                templateUrl: './tpl/manager/permission/editPermission.html',
                controller: 'EditPermissionCtrl'
            })

        //post
            .state('post', {
                url:'/post',
                templateUrl: './tpl/post/base.html',
                resolve:{
                    loadDashboard:["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load("postDashboard");
                    }]
                }
            })
            .state('post.postIndex', {
                url: '/postIndex',
                templateUrl: './tpl/post/postIndex.html',
                controller: 'PostTimelineCtrl'
            })
            .state('post.postDescription', {
                url: '/postDescription/:postId',
                templateUrl: './tpl/post/postDescription.html',
                controller: 'PostDescriptionCtrl'
            })
            .state('post.postManageIndex', {
                url: '/postManageIndex',
                templateUrl: './tpl/post/postManageIndex.html',
                controller: 'PostManageIndexCtrl',
                controllerAs: 'posts'
            })
            .state('post.postManageAdd', {
                url: '/postManageAdd',
                templateUrl: './tpl/post/postManageAdd.html',
                controller: 'PostManageAddCtrl'
            })
            .state('post.postManageEdit', {
                url: '/postManageEdit/:postId',
                templateUrl: './tpl/post/postManageEdit.html',
                controller: 'PostManageEditCtrl'
            })
            .state('post.postManageDestroy', {
                url: '/postManageDestroy',
                templateUrl: './tpl/post/postManageDestroy.html',
                controller: 'PostManageDestroyCtrl'
            })
            //service
            .state('service', {
                url:'/service',
                template: '<div ui-view></div>',
                resolve:{
                    loadDashboard:["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load("serviceDashboard");
                    }]
                }
            })
            .state('service.index', {
                url: '/index',
                templateUrl: './tpl/service/index.html',
                controller: 'ServiceIndexCtrl as vm'
            })
            .state('service.add', {
                url: '/add',
                templateUrl: './tpl/service/add.html',
                controller: 'ServiceAddCtrl as vm'
            })
            .state('service.edit', {
                url: '/edit/:serviceId',
                templateUrl: './tpl/service/edit.html',
                controller: 'ServiceEditCtrl as vm'
            })
            .state('service.destroy', {
                url: '/destroy',
                templateUrl: './tpl/service/destroy.html',
                controller: 'ServiceDestroyCtrl as vm'
            })
            //info
            .state('info', {
                url:'/info',
                template: '<div ui-view></div>',
                resolve:{
                    loadDashboard:["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load("infoDashboard");
                    }]
                }
            })
            .state('info.index', {
                url: '/index',
                templateUrl: './tpl/info/index.html',
                controller: 'InfoIndexCtrl as vm'
            })
            .state('info.add', {
                url: '/add',
                templateUrl: './tpl/info/add.html',
                controller: 'InfoAddCtrl as vm'
            })
            .state('info.edit', {
                url: '/edit/:infoId',
                templateUrl: './tpl/info/edit.html',
                controller: 'InfoEditCtrl as vm'
            })
    }
    ])
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
