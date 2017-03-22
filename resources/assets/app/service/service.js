/**
 * Created by summer on 2017/3/22.
 */

;(function (angular) {
    'use strict';

    angular.module('serviceDashboard', [])
        .service('ServiceCateService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.servicesInfo = {};
                me.fnGetServices = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.servicesInfo) || type == 'remote') {
                        $http.get("/service").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.servicesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.servicesInfo.data,filterValue);

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
                me.fnAddService = function (service) {
                    if(service.pending) return;
                    service.pending =true;
                    $http.post('/service', service)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                service.addStatus = true;
                                me.servicesInfo = {};//reload
                                $timeout(function () {
                                    service.addStatus = null;
                                }, 2000);
                            } else {
                                service.addStatus = false;
                            }
                        }, function (e) {
                            service.addStatus = false;
                        })
                        .finally(function () {
                            service.pending = false;
                        })
                };

                //edit 修改
                me.fnEditService = function (serviceInfo) {
                    if(serviceInfo.pending) return;
                    serviceInfo.pending =true;
                    $http.put('/service/'+serviceInfo.id, serviceInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                serviceInfo.editStatus = true;
                                me.servicesInfo = {};//reload
                                $timeout(function () {
                                    serviceInfo.editStatus = null;
                                }, 2000);
                            } else {
                                serviceInfo.editStatus = false;
                            }
                        }, function (e) {
                            serviceInfo.editStatus = false;
                        })
                        .finally(function () {
                            serviceInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyService = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/service/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.servicesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('ServiceIndexCtrl', [
            'ServiceCateService',
            'NgTableParams',
            'dialogs',
            function (ServiceCateService, NgTableParams, dialogs) {

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
                            return ServiceCateService.fnGetServices(self.filterValue, params, getType);
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
                self.fnDestoryService = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该service吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        ServiceCateService.fnDestroyService(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除service');
                    });
                }

            }])
        .controller('ServiceAddCtrl', [
            '$scope',
            'ServiceCateService',
            function ($scope, ServiceCateService) {
                $scope.serviceInfo = {};

                $scope.fnAddService = function () {
                    ServiceCateService.fnAddService($scope.serviceInfo);
                }
            }
        ])
        .controller('ServiceEditCtrl', [
            '$scope',
            'ServiceCateService',
            '$filter',
            'dialogs',
            function ($scope, ServiceCateService, $filter, dialogs) {

                $scope.serviceInfo = {};

                var serviceId = $scope.$stateParams.serviceId;

                ServiceCateService.fnGetServices().then(function (r) {
                    var servicesInfo = $filter('filter')(r, {id: serviceId});
                    angular.forEach(servicesInfo, function (value, key) {
                        //所有的services中取出id为serviceId的一条数据
                        if(value.id == serviceId) {
                            $scope.serviceInfo = value;
                            return false;
                        }
                    });

                    //没有这个service
                    if(angular.equals({}, $scope.serviceInfo)) {
                        dialogs.error('Error', '未找到该service', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.service.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditService = function () {
                    ServiceCateService.fnEditService($scope.serviceInfo);
                }
            }
        ]);
})(angular);