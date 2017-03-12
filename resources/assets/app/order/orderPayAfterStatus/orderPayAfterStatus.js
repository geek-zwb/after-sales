/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('OrderPayAfterStatusDashboard', [])
        .service('OrderPayAfterStatusService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.statusesInfo = {};
                me.fnGetOrderPayAfterStatuses = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();

                    if(angular.equals({}, me.statusesInfo) || type == 'remote') {
                        $http.get("/orderPayAfterStatus").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.statusesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.statusesInfo.data,filterValue);

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
                me.fnAddOrderPayAfterStatus = function (status) {
                    if(status.pending) return;
                    status.pending =true;
                    $http.post('/orderPayAfterStatus', status)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                status.addOrderPayAfterStatus = true;
                                me.statusesInfo = {};//reload
                                $timeout(function () {
                                    status.addOrderPayAfterStatus = null;
                                }, 2000);
                            } else {
                                status.addOrderPayAfterStatus = false;
                            }
                        }, function (e) {
                            status.addOrderPayAfterStatus = false;
                        })
                        .finally(function () {
                            status.pending = false;
                        })
                };

                //edit 修改
                me.fnEditOrderPayAfterStatus = function (statusInfo) {
                    if(statusInfo.pending) return;
                    statusInfo.pending =true;
                    $http.put('/orderPayAfterStatus/'+statusInfo.id, statusInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                statusInfo.editOrderPayAfterStatus = true;
                                me.statusesInfo = {};//reload
                                $timeout(function () {
                                    statusInfo.editOrderPayAfterStatus = null;
                                }, 2000);
                            } else {
                                statusInfo.editOrderPayAfterStatus = false;
                            }
                        }, function (e) {
                            statusInfo.editOrderPayAfterStatus = false;
                        })
                        .finally(function () {
                            statusInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyOrderPayAfterStatus = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/orderPayAfterStatus/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.statusesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('OrderPayAfterStatusIndexCtrl', [
            'OrderPayAfterStatusService',
            'NgTableParams',
            'dialogs',
            function (OrderPayAfterStatusService, NgTableParams, dialogs) {

                var getType = 'cache';// 每次去拉取posts的方式: cache or remote

                var self = this;

                self.filterValue ='';

                self.deleteAction = {};//删除的状态 pendding 和 status

                self.$injet = ["NgTableParams", "ngTableSimpleList"];

                self.tableParams = createUsingFullOptions();

                // init
                function createUsingFullOptions() {
                    var initialParams = {
                        page: 1,
                        sorting: { created_at: "desc" }
                    };
                    var initialSettings = {
                        getData: function(params) {
                            return OrderPayAfterStatusService.fnGetOrderPayAfterStatuses(self.filterValue, params, getType);
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
                    dlg = dialogs.confirm('Confirm','确定要删除该国家吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        OrderPayAfterStatusService.fnDestroyOrderPayAfterStatus(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除status');
                    });
                }

            }])
        .controller('OrderPayAfterStatusAddCtrl', [
            '$scope',
            'OrderPayAfterStatusService',
            function ($scope, OrderPayAfterStatusService) {

                $scope.orderPayAfterStatusInfo = {};

                $scope.fnAddOrderPayAfterStatus = function () {
                    OrderPayAfterStatusService.fnAddOrderPayAfterStatus($scope.orderPayAfterStatusInfo);
                }
            }
        ])
        .controller('OrderPayAfterStatusEditCtrl', [
            '$scope',
            'OrderPayAfterStatusService',
            '$filter',
            'dialogs',
            function ($scope, OrderPayAfterStatusService, $filter, dialogs) {

                $scope.orderPayAfterStatusInfo = {};
                var orderPayAfterStatusId = $scope.$stateParams.orderPayAfterStatusId;

                OrderPayAfterStatusService.fnGetOrderPayAfterStatuses().then(function (r) {
                    var statusesInfo = $filter('filter')(r, {id: orderPayAfterStatusId});
                    angular.forEach(statusesInfo, function (value, key) {
                        //所有的statuses中取出id为postId的一条数据
                        if(value.id == orderPayAfterStatusId) {
                            $scope.orderPayAfterStatusInfo = value;
                            return false;
                        }
                    });

                    //没有这个status
                    if(angular.equals({}, $scope.statusInfo)) {
                        dialogs.error('Error', '未找到该状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.status.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditOrderPayAfterStatus = function () {
                    OrderPayAfterStatusService.fnEditOrderPayAfterStatus($scope.orderPayAfterStatusInfo);
                }
            }
        ]);
})(angular);