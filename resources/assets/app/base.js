/**
 * Created by Geek-zwb on 2016/11/18 0018.
 */
    'use strict';

    //绑定module
    var orderApp = angular.module('zwb', [
        'ui.router',
        'oc.lazyLoad',
        'orderApp.partials',
        'ui.bootstrap',
        'dialogs.main',
        'ngTable',
        //'ngResource',
        'commonDashboard',
        //'common',
        'userDashboard',
        'textAngular' //待解决
        //'managerDashboard'
    ]);
    orderApp.config([
        '$interpolateProvider',
        function ($interpolateProvider) {
            //定界符
            $interpolateProvider.startSymbol('[:');
            $interpolateProvider.endSymbol(':]');
        }])
        .run([
            '$rootScope',
            'UserService',
            'CommonService',
            function($rootScope,UserService,CommonService) {
            var userInfo = null;
            UserService.getProfile().then(function (r) {
                userInfo = {
                    userId: r.id,
                    name:r.name,
                    group_id:angular.isDefined(r.groups['0'])?r.groups['0'].id:'undefinded',
                    supervisor_id:angular.isDefined(r.groups['0'])?r.groups['0'].supervisor_id:'2'
                };
                $rootScope.gUserInfo = userInfo; //注册全局登陆user信息

                CommonService.fnGetPermissionsNameHad(r.id, r.groups['0'].id).then(function (data) {
                    $rootScope.gPermissionNameHad = data; //登陆用户拥有的权限
                })
            });

        }])
        .run([
            'ngTableDefaults',
            function (ngTableDefaults) {
            ngTableDefaults.$inject = ["ngTableDefaults"];
            ngTableDefaults.params.count = 10;
            ngTableDefaults.settings = {
                counts: [10, 20, 50, 100],
                paginationMaxBlocks: 3,
                paginationMinBlocks: 1
            }
        }]);