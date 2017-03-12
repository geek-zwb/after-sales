/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('ServerDashboard', [])
        .service('ServerService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;

                me.parentServers = {};
                me.fnGetParentServers = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.parentServers) || type == 'remote') {
                        $http.get("/server").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.parentServers = r.data.data;

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

                        var filteredData = CommonService.filterData(me.parentServers.data,filterValue);

                        //!ng-table
                        if(angular.isUndefined(params)) {
                            return $q.when(filteredData);
                        }

                        params.total(filteredData.length);
                        var transformedData = CommonService.sliceOrderData(filteredData,params);
                        return $q.when(transformedData);
                    }
                };

                me.serversInfo = {};
                me.fnGetServers = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.serversInfo) || type == 'remote') {
                        $http.get("/server").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.serversInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.serversInfo.data,filterValue);

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
                me.fnAddServer = function (server) {
                    if(server.pending) return;
                    server.pending =true;
                    $http.post('/server', server)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                server.addStatus = true;
                                me.serversInfo = {};//reload
                                $timeout(function () {
                                    server.addStatus = null;
                                }, 2000);
                            } else {
                                server.addStatus = false;
                            }
                        }, function (e) {
                            server.addStatus = false;
                        })
                        .finally(function () {
                            server.pending = false;
                        })
                };

                //edit 修改
                me.fnEditServer = function (serverInfo) {
                    if(serverInfo.pending) return;
                    serverInfo.pending =true;
                    $http.put('/server/'+serverInfo.id, serverInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                serverInfo.editStatus = true;
                                me.serversInfo = {};//reload
                                $timeout(function () {
                                    serverInfo.editStatus = null;
                                }, 2000);
                            } else {
                                serverInfo.editStatus = false;
                            }
                        }, function (e) {
                            serverInfo.editStatus = false;
                        })
                        .finally(function () {
                            serverInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyServer = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/server/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.serversInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('ServersIndexCtrl', [
            'ServerService',
            'NgTableParams',
            'dialogs',
            function (ServerService, NgTableParams, dialogs) {

                var getType = 'cache';// 每次去拉取posts的方式: cache or remote

                var self = this;

                ServerService.fnGetParentServers().then(function (r) {
                    self.parentServers = r;
                });

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
                        counts: [5, 20, 50, 100],
                        paginationMaxBlocks: 5,
                        paginationMinBlocks: 2,
                        getData: function(params) {
                            return ServerService.fnGetServers(self.filterValue, params, getType);
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
                    dlg = dialogs.confirm('Confirm','确定要删除该服务器吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        ServerService.fnDestroyServer(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除server');
                    });
                }

            }])
        .controller('ServerAddCtrl', [
            '$scope',
            'ServerService',
            function ($scope, ServerService) {
                $scope.serverInfo = {};
                ServerService.fnGetParentServers().then(function (r) {
                    console.log(r);
                    $scope.parentServers = r;
                });
                $scope.fnAddServer = function () {
                    ServerService.fnAddServer($scope.serverInfo);
                }
            }
        ])
        .controller('ServerEditCtrl', [
            '$scope',
            'ServerService',
            '$filter',
            'dialogs',
            function ($scope, ServerService, $filter, dialogs) {

                $scope.serverInfo = {};

                var serverId = $scope.$stateParams.serverId;

                ServerService.fnGetParentServers().then(function (r) {
                    console.log(r);
                    $scope.parentServers = r;
                });

                ServerService.fnGetServers().then(function (r) {
                    var serversInfo = $filter('filter')(r, {id: serverId});
                    angular.forEach(serversInfo, function (value, key) {
                        //所有的posts中取出id为postId的一条数据
                        if(value.id == serverId) {
                            $scope.serverInfo = value;
                            return false;
                        }
                    });

                    //没有这个server
                    if(angular.equals({}, $scope.serverInfo)) {
                        dialogs.error('Error', '未找到该服务器', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.server.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditServer = function () {
                    ServerService.fnEditServer($scope.serverInfo);
                }
            }
        ]);
})(angular);