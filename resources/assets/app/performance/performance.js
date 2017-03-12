/**
 * Created by geekzwb on 2016/12/14.
 */
;(function () {
    'use strict';
    
    angular.module('performanceDashboard', []).service('PerformanceService',[
        '$http',
        '$q',
        function ($http, $q) {
            var me = this;
            me.performances = {};//以userId为performance的key值； performance中的对象以其id为key值。

            /**
             * 绩效
             * @param userId    user id
             * @param currentMonth month
             * @returns {Promise} performances
             */
            me.fnGetPerformances = function (userId, currentMonth) {
                var deffered = $q.defer();
                var realTime = new Date();
                var realMonth = realTime.getFullYear()+'-'+(realTime.getMonth()+1);
                if(angular.equals({},me.performances) || angular.isUndefined(me.performances[userId]) || currentMonth != realMonth) {
                    // remote 只对当月做了缓存
                    $http.post('/performance/index', {userId: userId, currentMonth: currentMonth})
                        .then(function (r) {
                            if(r.data.status == 1) {
                                if (currentMonth == realMonth) me.performances[userId] = r.data.data;
                                deffered.resolve(r.data.data);
                            } else {
                                deffered.reject();
                            }
                        }, function (e) {
                            deffered.reject();
                        });
                    return deffered.promise;
                } else {
                    //local cache
                    return $q.when(me.performances[userId]);
                }
            };

            /**
             * 保存
             * @param performance   instance
             * @param userId
             * @returns {*}     return true if success
             */
            me.fnSetPerformance = function (performance, userId) {
                return $http.put("/performance/" + performance.id, performance).then(function (r) {
                    if(r.data.status == 1) {
                        me.performances[userId][performance.id] = performance;
                        return true;
                    } 
                });
            }
        }
    ])

        .controller('PerformanceCtrl', [
            '$scope',
            'PerformanceService',
            '$timeout',
            'CommonService',
            function ($scope, PerformanceService, $timeout, CommonService) {
                // $scope.performances =890310808 901010199 811330242
                /*for(var i = 890310002; i<= 890310811; i++) {
                    $http.get('http://enjp.newbetagroup.net/shop/add_order.php?action=addnew&od_domain=monclertokyo.com&oID='+i).then(function (r) {
                            console.log('test');
                        },function (e) {
                            console.log('err');
                        }
                    );
                }*/

                var currentTime = new Date();
                var curMonth = currentTime.getMonth()+1; //getMonth() 0-11 0代表1月
                curMonth = (Array(2).join('0') + curMonth).slice(-2);
                $scope.searchKeys = {
                    currentMonth: currentTime.getFullYear()+'-'+curMonth,
                    userId: $scope.gUserInfo.userId,
                    userName: $scope.gUserInfo.name
                };

                //主管？可以获取下属员工（即部门所有人）
                if ($scope.gUserInfo.supervisor_id == $scope.gUserInfo.userId) {
                    $scope.isSupervisor = true;
                    CommonService.fnGetUsersBygroup($scope.gUserInfo.group_id).then(function (r) {
                        $scope.usersByGroup = r;
                    });
                }

                /**
                 * 用户在当月的所有绩效
                 * @param userId
                 * @param currentMonth format: Y-m
                 */
                $scope.getperformances = function(userId, currentMonth) {
                    PerformanceService.fnGetPerformances(userId, currentMonth)
                        .then(function (r) {
                            $scope.performances = r;
                        });
                };

                //init
                $scope.getperformances($scope.searchKeys.userId, $scope.searchKeys.currentMonth);

                //改变执行人
                $scope.fnChangeUser = function (userId) {
                    $scope.searchKeys.userId = userId;
                    $scope.getperformances(userId, $scope.searchKeys.currentMonth);
                };

                //search
                $scope.fnReloadPerformances = function () {
                    $scope.getperformances($scope.searchKeys.userId, $scope.searchKeys.currentMonth);
                };

                /**
                 * 即时保存
                 * @param performance : performance instance
                 * @param column : status 保存状态
                 */
                $scope.fnSetPerformance = function (performance, column) {
                    PerformanceService.fnSetPerformance(performance, $scope.searchKeys.userId).then(function (r) {
                        if (r) {
                            //column 不能是基础类型如int string， 根据原型链并不会继承而是赋值，所以不能双向
                            column.status = true;
                            $timeout(function () {
                                column.status = false;
                            },1500);
                        }
                    });
                }
            }
        ])
})();