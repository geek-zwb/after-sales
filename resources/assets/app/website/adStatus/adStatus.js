/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('AdStatusDashboard', [])
        .service('AdStatusService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.adStatusesInfo = {};
                me.fnGetAdStatuses = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.adStatusesInfo) || type == 'remote') {
                        $http.get("/adStatus").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.adStatusesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.adStatusesInfo.data,filterValue);

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
                me.fnAddAdStatus = function (adStatus) {
                    if(adStatus.pending) return;
                    adStatus.pending =true;
                    $http.post('/adStatus', adStatus)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                adStatus.addStatus = true;
                                me.adStatusesInfo = {};//reload
                                $timeout(function () {
                                    adStatus.addStatus = null;
                                }, 2000);
                            } else {
                                adStatus.addStatus = false;
                            }
                        }, function (e) {
                            adStatus.addStatus = false;
                        })
                        .finally(function () {
                            adStatus.pending = false;
                        })
                };

                //edit 修改
                me.fnEditAdStatus = function (adStatusInfo) {
                    if(adStatusInfo.pending) return;
                    adStatusInfo.pending =true;
                    $http.put('/adStatus/'+adStatusInfo.id, adStatusInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                adStatusInfo.editStatus = true;
                                me.adStatusesInfo = {};//reload
                                $timeout(function () {
                                    adStatusInfo.editStatus = null;
                                }, 2000);
                            } else {
                                adStatusInfo.editStatus = false;
                            }
                        }, function (e) {
                            adStatusInfo.editStatus = false;
                        })
                        .finally(function () {
                            adStatusInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyAdStatus = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/adStatus/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.adStatusesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('AdStatusIndexCtrl', [
            'AdStatusService',
            'NgTableParams',
            'dialogs',
            function (AdStatusService, NgTableParams, dialogs) {

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
                            return AdStatusService.fnGetAdStatuses(self.filterValue, params, getType);
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
                        AdStatusService.fnDestroyAdStatus(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除adStatus');
                    });
                }

            }])
        .controller('AdStatusAddCtrl', [
            '$scope',
            'AdStatusService',
            function ($scope, AdStatusService) {
                $scope.adStatusInfo = {};

                $scope.fnAddAdStatus = function () {
                    AdStatusService.fnAddAdStatus($scope.adStatusInfo);
                }
            }
        ])
        .controller('AdStatusEditCtrl', [
            '$scope',
            'AdStatusService',
            '$filter',
            'dialogs',
            function ($scope, AdStatusService, $filter, dialogs) {

                $scope.adStatusInfo = {};

                var adStatusId = $scope.$stateParams.adStatusId;

                AdStatusService.fnGetAdStatuses().then(function (r) {
                    var adStatusesInfo = $filter('filter')(r, {id: adStatusId});
                    angular.forEach(adStatusesInfo, function (value, key) {
                        //所有的adStatuses中取出id为postId的一条数据
                        if(value.id == adStatusId) {
                            $scope.adStatusInfo = value;
                            return false;
                        }
                    });

                    //没有这个adStatus
                    if(angular.equals({}, $scope.adStatusInfo)) {
                        dialogs.error('Error', '未找到该广告状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.adStatus.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditAdStatus = function () {
                    AdStatusService.fnEditAdStatus($scope.adStatusInfo);
                }
            }
        ]);
})(angular);