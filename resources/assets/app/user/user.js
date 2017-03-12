/**
 * Created by Geek-zwb on 2016/11/19 0019.
 */

;(function () {

    'use strict';

    angular.module('userDashboard', [])
        .service('UserService', [
            '$http',
            '$state',
            '$filter',
            '$q',
            function ($http, $state,$filter,$q) {
                var me = this;
                me.profileData = {};//用户信息

                me.askLeaveInfo = {
                    type: '事假',
                    total_time: 0,
                    status: false
                };//一次请假

                me.leavesInfo = {};

                //获取用户自身信息
                me.getProfile = function () {
                        var deffered = $q.defer();
                        if(angular.equals({}, me.profileData)) {
                            $http.get("user/getProfile").then(function (r) {

                                if(r.status !== 200 || r.data.status !=1) {
                                    deffered.reject();
                                    return;
                                }

                                me.profileData = r.data.data['user'];
                                me.profileData.password = '';

                                deffered.resolve(me.profileData);
                            });
                            return deffered.promise;
                        } else {
                            return $q.when(me.profileData);
                        }
                };

                //更新个人资料
                me.profileUpdate = function () {
                    $http.post('user/profileUpdate', me.profileData)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                me.profileData.updateStatus = true;
                            }
                        }, function (e) {
                            //error
                        })
                };

                //请假申请
                me.askforLeave = function () {
                    if(me.pending) return;//防止重复请求
                    me.pending =true;
                    console.log(me.askLeaveInfo);
                    $http.post('leave', me.askLeaveInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                //申请请假成功
                                me.askLeaveInfo.status = true;
                                setTimeout(function () {
                                    me.askLeaveInfo = {};
                                   // $state.go('allLeaves');
                                },3000);
                                // me.askLeaveInfo = {};
                            } else {
                                me.askLeaveInfo.err = r.data.msg;
                                setTimeout(function () {
                                    me.askLeaveInfo.err = null;
                                },2000);
                            }
                        },function (e) {
                            // error
                        })
                        .finally(function () {
                            me.pending = false;
                        })
                }
            }
        ])

        .service("LeaveService", [
            '$http',
            '$filter',
            '$q',
            function($http, $filter,$q){
                var cachedData; //请假记录

                var dataLength; //后台获取的总共条数

                function filterData(data, filter){
                    return $filter('filter')(data, filter);
                }

                function orderData(data, params){
                    return params.sorting() ? $filter('orderBy')(data, params.orderBy()) : filteredData;
                }

                function sliceData(data, params){
                    return data.slice((params.page() - 1) * params.count(), params.page() * params.count())
                }

                function transformData(data,filter,params){
                    return sliceData( orderData( filterData(data,filter), params ), params);
                }

                this.fnGetLeaves = function(params) {
                    console.log(params.sorting());
                    console.log(params.orderBy());
                    var deffered = $q.defer();


                    //还要加上判断chcheData中的数据够不够显示,暂缓
                    if(angular.isUndefined(cachedData)) {
                        $http.get("/leave").then(function (r) {

                            if(r.status !== 200 || r.data.status !=1) {
                                deffered.reject();
                                return;
                            }

                            dataLength = r.data.data.recordsTotal;
                            params.total(dataLength);
                            cachedData = r.data.data.data;
                            var transformedData = sliceData(orderData(cachedData,params),params);
                            console.log('cachedData', transformedData);
                            deffered.resolve(transformedData);
                        });
                        return deffered.promise;
                    } else {
                        //var filteredData = filterData(cachedData,filter);
                        var transformedData = sliceData(orderData(cachedData,params),params);
                        console.log('realcache',transformedData);
                        params.total(dataLength);
                        return $q.when(transformedData);
                    }
                };


                /*return {
                    getLeaves: fnGetLeaves()
                }*/
        }])

        //show user info
        .controller('UserInfoController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
                UserService.getProfile();
            }
        ])

        //update profile
        .controller('ProfileUpdateController', [
            '$scope',
            'UserService',
            function ($scope, UserService) {
                $scope.User = UserService;
                UserService.getProfile();
            }
        ])

        //请假条
        .controller('AskforLeaveController', [
            '$scope',
            'UserService',
            '$filter',
            function ($scope, UserService,$filter) {
                $scope.User = UserService;
                /*if(UserService.profileData == null || angular.equals({}, UserService.profileData)) {
                     UserService.getProfile(); //从服务器得到UserService.profileData，并不能马上用怎么办？？？？？？
                }*/

                //初始值
                //遗留问题，当UserService.profileData 尚未加载时？？？？ 监控profileData的值？ promise解决？全局变量？
               // UserService.askLeaveInfo.user_id = UserService.profileData.id;
                UserService.askLeaveInfo.user_id = $scope.gUserInfo.userId;
               //UserService.askLeaveInfo.supervisor_id = UserService.profileData.groups[0].supervisor_id ?UserService.profileData.groups[0].supervisor_id:1;
               UserService.askLeaveInfo.supervisor_id = $scope.gUserInfo.supervisor_id;
                var dateFilter = $filter('date');
                UserService.askLeaveInfo.begin = dateFilter(new Date(),'yyyy/MM/dd HH:mm');
                UserService.askLeaveInfo.end = dateFilter(new Date(),'yyyy/MM/dd HH:mm');

                //计算请假时间
                $scope.$watch(function () {
                    return {
                        from: UserService.askLeaveInfo.begin,
                        to: UserService.askLeaveInfo.end
                    };
                }, function (newData, oldData) {
                    var total_time = 0;
                    var from = new Date(newData.from);
                    var to = new Date(newData.to);
                    if(from > to) {
                        //结束时间需大于开始时间
                        $scope.message = '结束时间需大于开始时间';
                        return;
                    }
                    var result = getWorkDayCount(from, to);
                    UserService.askLeaveInfo.total_day = result[0];
                    UserService.askLeaveInfo.total_hour = result[1];
                    UserService.askLeaveInfo.total_time = 9*parseInt(result[0]) + parseFloat(result[1]);
                },true);

                function nearlyWeeks (weekcount, end) {
                    //计算end时间，周的第一天
                    var overTime = new Date(end);
                    var days = 0 ;
                    days = (overTime.getDay() == 0 ? 7 : overTime.getDay());//overTime.getDay()为0是星期天
                    var ss = (days + weekcount * 7) * 24 * 60 * 60 * 1000;
                    return new Date(end - ss);
                }

                /**
                 * 计算请假时间的工作日
                 * @param beginDay
                 * @param endDay
                 * @returns {*[天数, 小时数]}
                 */
                function getWorkDayCount (beginDay, endDay) {
                    /*
                    计算一段时间内工作的天数。不包括周末，周末为周六下午、周日一天半
                    beginDay -时间段开始日期
                    endDay -时间段结束日期
                    */
                    //每天的毫秒总数
                    var daytime = 24 * 60 * 60 * 1000;
                    //两个时间段相隔的总天数
                    var days;
                    days = (endDay - beginDay) / daytime;

                    //减去不用上班的时间,即09-18之外的时间
                    var beginDayHour = beginDay.getHours()<9 ? 9:beginDay.getHours();
                    var endDayHour = endDay.getHours() > 18 ? 18 : endDay.getHours();
                    var totalminutes = endDayHour*60+endDay.getMinutes() - beginDayHour*60-beginDay.getMinutes();

                    //剩余的小时数
                    var hours= totalminutes/60;

                    //时间段起始时间所在周的第一天
                    var beginWeekFirstDay=nearlyWeeks(0,beginDay.getTime()).getTime();
                    //时间段结束时间所在周的最后一天
                    var endWeekOverDay=nearlyWeeks(0,endDay.getTime()).getTime() + 6*daytime;
                    //由beginWeekFirstDay和endWeekOverDay换算出，周末的天数
                    var weekEndCount = ((endWeekOverDay - beginWeekFirstDay) / daytime + 1) / 7 * 1.5 - 1.5;
                    
                    //调整周末天数的值
                    if(weekEndCount != 0){
                        if(endDay.getDay()>0 && endDay.getDay<6)
                            weekEndCount -=1.5;
                        if (endDay.getDay() == 6)
                            weekEndCount -= 0.5;
                        if (beginDay.getDay() == 0) weekEndCount -= 0.5;
                    }
                    var weekInt = parseInt(weekEndCount);
                    var weekfix = weekEndCount.toFixed(1) - parseInt(weekEndCount);
                    if(weekfix >= 0.4 && weekfix <= 0.6) {
                        weekfix = 0.5;
                    } else {
                        weekfix = 0;
                    }

                    //工作日 = 总天数 - 周末天数
                    var dayInt = parseInt(days);
                    var dayfix = days.toFixed(1) - parseInt(days);
                    var day = dayInt - weekInt;
                    if(dayfix >= 0.4 && dayfix <= 0.6) {
                        dayfix = 0.5;
                    } else if(dayfix < 0.4) {
                        dayfix = 0;
                    } else {
                        day +=1;
                        dayfix = 0;
                    }
                    hours += dayfix * 9;
                    hours = hours - weekfix*9;

                    day = hours < 0 ? (day -1) : day;
                    hours = hours < 0 ? (hours + 9) : hours;
                    hours = hours.toFixed(1);

                    return [day, hours];
                }
            }
        ])
    
        //请假记录
        .controller('GetLeavesController', [
            '$scope',
            'LeaveService',
            '$filter',
            '$location',
            'NgTableParams',
            function ($scope, LeaveService, $filter, $location, NgTableParams) {
                var self = this;
                self.$injet = ["NgTableParams", "ngTableSimpleList"];
               // self.defaultConfigTableParams = new NgTableParams({}, { dataset: data});
                self.tableParams = createUsingFullOptions();
                self.cols = [
                    { field: "created_at", title: "申请时间", sortable: "created_at", show: true },
                    { field: "type", title: "请假原因", show: true },
                    { field: "grant", title: "审批结果", show: true },
                    { field: "begin", title: "开始请假时间", sortable: "begin", show: true},
                    { field: "end", title: "结束请假时间", sortable: "end", show: true},
                    { field: "total_time", title: "合计请假时数", sortable: "total_time", show: true}
                ];

                function createUsingFullOptions() {
                    var initialParams = {
                        page: 1,
                        sorting: { created_at: "asc" }
                    };
                    var initialSettings = {
                        filterDelay: 0,
                        paginationMaxBlocks: 3,
                        paginationMinBlocks: 2,
                        getData: function(params) {
                            $location.search(params.url()); // 将参数放到url上，实现刷新页面不会跳回第一页和默认配置
                           return LeaveService.fnGetLeaves(params);
                        }
                    };
                    return new NgTableParams(initialParams, initialSettings);
                }

            }
        ])


})();