/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('MallStatusDashboard', [])
        .service('MallStatusService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.mallStatusesInfo = {};
                me.fnGetMallStatus = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.mallStatusesInfo) || type == 'remote') {
                        $http.get("/mallStatus").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.mallStatusesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.mallStatusesInfo.data,filterValue);

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
                me.fnAddMallStatus = function (mallStatus) {
                    if(mallStatus.pending) return;
                    mallStatus.pending =true;
                    $http.post('/mallStatus', mallStatus)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                mallStatus.addStatus = true;
                                me.mallStatusesInfo = {};//reload
                                $timeout(function () {
                                    mallStatus.addStatus = null;
                                }, 2000);
                            } else {
                                mallStatus.addStatus = false;
                            }
                        }, function (e) {
                            mallStatus.addStatus = false;
                        })
                        .finally(function () {
                            mallStatus.pending = false;
                        })
                };

                //edit 修改
                me.fnEditMallStatus = function (mallStatusInfo) {
                    if(mallStatusInfo.pending) return;
                    mallStatusInfo.pending =true;
                    $http.put('/mallStatus/'+mallStatusInfo.id, mallStatusInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                mallStatusInfo.editStatus = true;
                                me.mallStatusesInfo = {};//reload
                                $timeout(function () {
                                    mallStatusInfo.editStatus = null;
                                }, 2000);
                            } else {
                                mallStatusInfo.editStatus = false;
                            }
                        }, function (e) {
                            mallStatusInfo.editStatus = false;
                        })
                        .finally(function () {
                            mallStatusInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyMallStatus = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/mallStatus/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.mallStatusesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('MallStatusIndexCtrl', [
            'MallStatusService',
            'NgTableParams',
            'dialogs',
            function (MallStatusService, NgTableParams, dialogs) {

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
                            return MallStatusService.fnGetMallStatus(self.filterValue, params, getType);
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
                    dlg = dialogs.confirm('Confirm','确定要删除该状态吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        MallStatusService.fnDestroyMallStatus(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除mallStatus');
                    });
                }

            }])
        .controller('MallStatusAddCtrl', [
            '$scope',
            'MallStatusService',
            function ($scope, MallStatusService) {
                $scope.mallStatusInfo = {};

                $scope.fnAddMallStatus = function () {
                    MallStatusService.fnAddMallStatus($scope.mallStatusInfo);
                }
            }
        ])
        .controller('MallStatusEditCtrl', [
            '$scope',
            'MallStatusService',
            '$filter',
            'dialogs',
            function ($scope, MallStatusService, $filter, dialogs) {

                $scope.mallStatusInfo = {};

                var mallStatusId = $scope.$stateParams.mallStatusId;
                MallStatusService.fnGetMallStatus().then(function (r) {
                    var mallStatusesInfo = $filter('filter')(r, {id: mallStatusId});

                    angular.forEach(mallStatusesInfo, function (value, key) {
                        //所有的mallStatuses中取出id为postId的一条数据
                        if(value.id == mallStatusId) {
                            $scope.mallStatusInfo = value;
                            return false;
                        }
                    });

                    //没有这个mallStatus
                    if(angular.equals({}, $scope.mallStatusInfo)) {
                        dialogs.error('Error', '未找到该网站状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('mall.mallStatus.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditMallStatus = function () {
                    MallStatusService.fnEditMallStatus($scope.mallStatusInfo);
                }
            }
        ]);
})(angular);