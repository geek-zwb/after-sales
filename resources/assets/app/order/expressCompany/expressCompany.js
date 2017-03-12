/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('ExpressCompanyDashboard', [])
        .service('ExpressCompanyService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.expressCompaniesInfo = {};
                me.fnGetExpressCompanies = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();

                    if(angular.equals({}, me.expressCompaniesInfo) || type == 'remote') {
                        $http.get("/expressCompany").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.expressCompaniesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.expressCompaniesInfo.data,filterValue);

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
                me.fnAddExpressCompany = function (expressCompany) {
                    if(expressCompany.pending) return;
                    expressCompany.pending =true;
                    $http.post('/expressCompany', expressCompany)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                expressCompany.addStatus = true;
                                me.expressCompaniesInfo = {};//reload
                                $timeout(function () {
                                    expressCompany.addStatus = null;
                                }, 2000);
                            } else {
                                expressCompany.addStatus = false;
                            }
                        }, function (e) {
                            expressCompany.addStatus = false;
                        })
                        .finally(function () {
                            expressCompany.pending = false;
                        })
                };

                //edit 修改
                me.fnEditExpressCompany = function (expressCompanyInfo) {
                    if(expressCompanyInfo.pending) return;
                    expressCompanyInfo.pending =true;
                    $http.put('/expressCompany/'+expressCompanyInfo.id, expressCompanyInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                expressCompanyInfo.editStatus = true;
                                me.expressCompaniesInfo = {};//reload
                                $timeout(function () {
                                    expressCompanyInfo.editStatus = null;
                                }, 2000);
                            } else {
                                expressCompanyInfo.editStatus = false;
                            }
                        }, function (e) {
                            expressCompanyInfo.editStatus = false;
                        })
                        .finally(function () {
                            expressCompanyInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyExpressCompany = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/expressCompany/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.expressCompaniesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('ExpressCompanyIndexCtrl', [
            'ExpressCompanyService',
            'NgTableParams',
            'dialogs',
            function (ExpressCompanyService, NgTableParams, dialogs) {

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
                            return ExpressCompanyService.fnGetExpressCompanies(self.filterValue, params, getType);
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
                self.fnDestoryExpressCompany = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该国家吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        ExpressCompanyService.fnDestroyExpressCompany(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除expressCompany');
                    });
                }

            }])
        .controller('ExpressCompanyAddCtrl', [
            '$scope',
            'ExpressCompanyService',
            function ($scope, ExpressCompanyService) {

                $scope.expressCompanyInfo = {};

                $scope.fnAddExpressCompany = function () {
                    ExpressCompanyService.fnAddExpressCompany($scope.expressCompanyInfo);
                }
            }
        ])
        .controller('ExpressCompanyEditCtrl', [
            '$scope',
            'ExpressCompanyService',
            '$filter',
            'dialogs',
            function ($scope, ExpressCompanyService, $filter, dialogs) {

                $scope.expressCompanyInfo = {};
                var expressCompanyId = $scope.$stateParams.expressCompanyId;

                ExpressCompanyService.fnGetExpressCompanies().then(function (r) {
                    var expressCompaniesInfo = $filter('filter')(r, {id: expressCompanyId});
                    angular.forEach(expressCompaniesInfo, function (value, key) {
                        //所有的expressCompanies中取出id为postId的一条数据
                        if(value.id == expressCompanyId) {
                            $scope.expressCompanyInfo = value;
                            return false;
                        }
                    });

                    //没有这个expressCompany
                    if(angular.equals({}, $scope.expressCompanyInfo)) {
                        dialogs.error('Error', '未找到该状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.expressCompany.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditExpressCompany = function () {
                    ExpressCompanyService.fnEditExpressCompany($scope.expressCompanyInfo);
                }
            }
        ]);
})(angular);