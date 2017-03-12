/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('MallDashboard', [])
        .service('MallService', [
            '$http',
            '$q',
            'CommonService',
            'MallStatusService',
            '$timeout',
            function ($http, $q, CommonService, MallStatusService, $timeout) {
                var me = this;
                //表格顶部筛选
                me.arrmallStatuses = [];//[{id:1, title:"已付款"}]
                me.arrusersOptional = [];//[{id:1, title:"已付款"}]
                MallStatusService.fnGetMallStatus().then(function (r) {
                    me.mallStatuses = r;
                    angular.forEach(me.mallStatuses, function(value) {
                        var status = {};
                        status.title = value.name;
                        status.id = value.id;
                        me.arrmallStatuses.push(status);
                        console.log(me.arrmallStatuses);
                    })
                });

                CommonService.fnGetusersOptional().then(function (r) {
                    me.usersOptional = r.data;
                    angular.forEach(me.usersOptional, function(value) {
                        var status = {};
                        status.title = value.name;
                        status.id = value.id;
                        me.arrusersOptional.push(status);
                    })
                });
                me.mallsInfo = {};
                me.fnGetMalls = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote
                    var deffered = $q.defer();
                    if(angular.equals({}, me.mallsInfo) || type == 'remote') {
                        $http.get("/mall").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }
                            me.mallsInfo = r.data.data;

                            if(angular.isUndefined(params)) {
                                var filteredData = CommonService.filterData(r.data.data.data,filterValue);
                                deffered.resolve(filteredData);
                                return;
                            }
                            params.total(r.data.data.recordsTotal);

                            var transformedData = CommonService.transformData(r.data.data.data, filterValue, params);
                            deffered.resolve(transformedData);
                        });

                        return deffered.promise;

                    } else {

                        var filteredData = CommonService.filterData(me.mallsInfo.data,filterValue);

                        //!ng-table
                        if(angular.isUndefined(params)) {
                            return $q.when(filteredData);
                        }

                        params.total(filteredData.length);
                        var transformedData = CommonService.sliceOrderData(filteredData,params);
                        return $q.when(transformedData);
                    }
                };

                //新增
                me.fnAddMall = function (mall) {
                    if(mall.pending) return;
                    mall.pending =true;
                    $http.post('/mall', mall)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                mall.addMall = true;
                                me.mallsInfo = {};//reload
                                $timeout(function () {
                                    mall.addMall = null;
                                }, 2000);
                            } else {
                                mall.addMall = false;
                            }
                        }, function (e) {
                            mall.addMall = false;
                        })
                        .finally(function () {
                            mall.pending = false;
                        })
                };

                //edit 修改
                me.fnEditMall= function (mallInfo) {
                    if(mallInfo.pending) return;
                    mallInfo.pending =true;
                    $http.put('/mall/'+mallInfo.id, mallInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                mallInfo.editMall = true;
                                me.mallsInfo = {};//reload
                                $timeout(function () {
                                    mallInfo.editMall = null;
                                }, 2000);
                            } else {
                                mallInfo.editMall = false;
                            }
                        }, function (e) {
                            mallInfo.editMall = false;
                        })
                        .finally(function () {
                            mallInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyMalls = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/mall/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.mallsInfo = {}; //reload：本地循环还是服务器remote重新拉取？
                                deleteAction.status = true; //成功
                                $timeout(function () {
                                    deleteAction.status = null;
                                }, 2000);
                            } else {
                                deleteAction.status = false;
                            }
                        })
                        .finally(function () {
                            deleteAction.pending = false;
                        });
                }
                
            }
        ])
        .controller('MallIndexCtrl', [
            'MallService',
            'NgTableParams',
            'dialogs',
            function (MallService, NgTableParams, dialogs) {

                var getType = 'cache';// 每次去拉取posts的方式: cache or remote
                var self = this;

                self.mallService =MallService;
                self.filterValue ='';

                self.deleteAction = {};//删除的状态 pendding 和 status

                self.$injet = ["NgTableParams", "ngTableSimpleList"];

                self.tableParams = createUsingFullOptions();

                // init
                function createUsingFullOptions() {
                    var initialParams = {
                        page: 1,
                        sorting: { id: "desc" }
                    };
                    var initialSettings = {
                        getData: function(params) {
                            return MallService.fnGetMalls(self.filterValue, params, getType);
                        }
                    };
                    return new NgTableParams(initialParams, initialSettings);
                }
                //筛选
                self.fnSearchChange = function () {
                    self.tableParams.reload();
                };

                //确认删除模态框
                var dlg = null;
                self.fnDestoryPost = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该付款方式吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        MallService.fnDestroyMalls(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除付款方式');
                    });
                }

            }])
        .controller('MallAddCtrl', [
            '$scope',
            'MallService',
            function ($scope, MallService) {
                $scope.mallInfo = {};
                $scope.mallService = MallService;
                $scope.fnAddMall = function () {
                    MallService.fnAddMall($scope.mallInfo);
                }
            }
        ])
        .controller('MallEditCtrl', [
            '$scope',
            'MallService',
            '$filter',
            'dialogs',
            function ($scope, MallService, $filter, dialogs) {

                $scope.mallInfo = {};
                var mallId = $scope.$stateParams.mallId;


                MallService.fnGetMalls().then(function (r) {
                    var mallsInfo = $filter('filter')(r, {id: mallId});
                    angular.forEach(mallsInfo, function (value, key) {
                        //所有的malls中取出id为postId的一条数据
                        if(value.id == mallId) {
                            $scope.mallInfo = value;
                            return false;
                        }
                    });
                    //没有这个mall
                    if(angular.equals({}, $scope.mallInfo)) {
                        dialogs.error('Error', '未找到该状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('mall.mall.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditMall = function () {
                    MallService.fnEditMall($scope.mallInfo);
                }
            }
        ]);
})(angular);