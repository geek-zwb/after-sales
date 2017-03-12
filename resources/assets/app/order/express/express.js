/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('ExpressDashboard', [])
        .service('ExpressService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.expressesInfo = {};
                me.fnGetExpresses = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();

                    if(angular.equals({}, me.expressesInfo) || type == 'remote') {
                        $http.get("/express").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.expressesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.expressesInfo.data,filterValue);

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
                me.fnAddExpress = function (express) {
                    if(express.pending) return;
                    express.pending =true;
                    $http.post('/express', express)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                express.addStatus = true;
                                me.expressesInfo = {};//reload
                                $timeout(function () {
                                    express.addStatus = null;
                                }, 2000);
                            } else {
                                express.addStatus = false;
                            }
                        }, function (e) {
                            express.addStatus = false;
                        })
                        .finally(function () {
                            express.pending = false;
                        })
                };

                //edit 修改
                me.fnEditExpress = function (expressInfo) {
                    if(expressInfo.pending) return;
                    expressInfo.pending =true;
                    $http.put('/express/'+expressInfo.id, expressInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                expressInfo.editStatus = true;
                                me.expressesInfo = {};//reload
                                $timeout(function () {
                                    expressInfo.editStatus = null;
                                }, 2000);
                            } else {
                                expressInfo.editStatus = false;
                            }
                        }, function (e) {
                            expressInfo.editStatus = false;
                        })
                        .finally(function () {
                            expressInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyExpress = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/express/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.expressesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('ExpressIndexCtrl', [
            'ExpressService',
            'NgTableParams',
            'dialogs',
            function (ExpressService, NgTableParams, dialogs) {

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
                            return ExpressService.fnGetExpresses(self.filterValue, params, getType);
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
                self.fnDestoryExpress = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该国家吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        ExpressService.fnDestroyExpress(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除express');
                    });
                }

            }])
        .controller('ExpressAddCtrl', [
            '$scope',
            'ExpressService',
            function ($scope, ExpressService) {

                $scope.expressInfo = {};

                $scope.fnAddExpress = function () {
                    ExpressService.fnAddExpress($scope.expressInfo);
                }
            }
        ])
        .controller('ExpressEditCtrl', [
            '$scope',
            'ExpressService',
            '$filter',
            'dialogs',
            function ($scope, ExpressService, $filter, dialogs) {

                $scope.expressInfo = {};
                var expressId = $scope.$stateParams.expressId;

                ExpressService.fnGetExpresses().then(function (r) {
                    var expressesInfo = $filter('filter')(r, {id: expressId});
                    angular.forEach(expressesInfo, function (value, key) {
                        //所有的expresses中取出id为postId的一条数据
                        if(value.id == expressId) {
                            $scope.expressInfo = value;
                            return false;
                        }
                    });

                    //没有这个express
                    if(angular.equals({}, $scope.expressInfo)) {
                        dialogs.error('Error', '未找到该express', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.express.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditExpress = function () {
                    ExpressService.fnEditExpress($scope.expressInfo);
                }
            }
        ]);
})(angular);