/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('HostDashboard', [])
        .service('HostService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.hostsInfo = {};
                me.fnGetHosts = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.hostsInfo) || type == 'remote') {
                        $http.get("/host").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.hostsInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.hostsInfo.data,filterValue);

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
                me.fnAddHost = function (host) {
                    if(host.pending) return;
                    host.pending =true;
                    $http.post('/host', host)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                host.addStatus = true;
                                me.hostsInfo = {};//reload
                                $timeout(function () {
                                    host.addStatus = null;
                                }, 2000);
                            } else {
                                host.addStatus = false;
                            }
                        }, function (e) {
                            host.addStatus = false;
                        })
                        .finally(function () {
                            host.pending = false;
                        })
                };

                //edit 修改
                me.fnEditHost = function (hostInfo) {
                    if(hostInfo.pending) return;
                    hostInfo.pending =true;
                    $http.put('/host/'+hostInfo.id, hostInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                hostInfo.editStatus = true;
                                me.hostsInfo = {};//reload
                                $timeout(function () {
                                    hostInfo.editStatus = null;
                                }, 2000);
                            } else {
                                hostInfo.editStatus = false;
                            }
                        }, function (e) {
                            hostInfo.editStatus = false;
                        })
                        .finally(function () {
                            hostInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyHost = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/host/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.hostsInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('HostIndexCtrl', [
            'HostService',
            'NgTableParams',
            'dialogs',
            function (HostService, NgTableParams, dialogs) {

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
                            return HostService.fnGetHosts(self.filterValue, params, getType);
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
                self.fnDestoryHost = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该host吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        HostService.fnDestroyHost(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除host');
                    });
                }

            }])
        .controller('HostAddCtrl', [
            '$scope',
            'HostService',
            function ($scope, HostService) {
                $scope.hostInfo = {};

                $scope.fnAddHost = function () {
                    HostService.fnAddHost($scope.hostInfo);
                }
            }
        ])
        .controller('HostEditCtrl', [
            '$scope',
            'HostService',
            '$filter',
            'dialogs',
            function ($scope, HostService, $filter, dialogs) {

                $scope.hostInfo = {};

                var hostId = $scope.$stateParams.hostId;

                HostService.fnGetHosts().then(function (r) {
                    var hostsInfo = $filter('filter')(r, {id: hostId});
                    angular.forEach(hostsInfo, function (value, key) {
                        //所有的hosts中取出id为postId的一条数据
                        if(value.id == hostId) {
                            $scope.hostInfo = value;
                            return false;
                        }
                    });

                    //没有这个host
                    if(angular.equals({}, $scope.hostInfo)) {
                        dialogs.error('Error', '未找到该host', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.host.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditHost = function () {
                    HostService.fnEditHost($scope.hostInfo);
                }
            }
        ]);
})(angular);