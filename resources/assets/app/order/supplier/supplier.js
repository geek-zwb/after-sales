/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('SupplierDashboard', [])
        .service('SupplierService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.suppliersInfo = {};
                me.fnGetSuppliers = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.suppliersInfo) || type == 'remote') {
                        $http.get("/supplier").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.suppliersInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.suppliersInfo.data,filterValue);

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
                me.fnAddSupplier = function (supplier) {
                    if(supplier.pending) return;
                    supplier.pending =true;
                    $http.post('/supplier', supplier)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                supplier.addStatus = true;
                                me.suppliersInfo = {};//reload
                                $timeout(function () {
                                    supplier.addStatus = null;
                                }, 2000);
                            } else {
                                supplier.addStatus = false;
                            }
                        }, function (e) {
                            supplier.addStatus = false;
                        })
                        .finally(function () {
                            supplier.pending = false;
                        })
                };

                //edit 修改
                me.fnEditSupplier = function (supplierInfo) {
                    if(supplierInfo.pending) return;
                    supplierInfo.pending =true;
                    $http.put('/supplier/'+supplierInfo.id, supplierInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                supplierInfo.editStatus = true;
                                me.suppliersInfo = {};//reload
                                $timeout(function () {
                                    supplierInfo.editStatus = null;
                                }, 2000);
                            } else {
                                supplierInfo.editStatus = false;
                            }
                        }, function (e) {
                            supplierInfo.editStatus = false;
                        })
                        .finally(function () {
                            supplierInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroySupplier = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/supplier/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.suppliersInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('SupplierIndexCtrl', [
            'SupplierService',
            'NgTableParams',
            'dialogs',
            function (SupplierService, NgTableParams, dialogs) {

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
                            return SupplierService.fnGetSuppliers(self.filterValue, params, getType);
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
                self.fnDestorySupplier = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该supplier吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        SupplierService.fnDestroySupplier(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除supplier');
                    });
                }

            }])
        .controller('SupplierAddCtrl', [
            '$scope',
            'SupplierService',
            function ($scope, SupplierService) {
                $scope.supplierInfo = {};

                $scope.fnAddSupplier = function () {
                    SupplierService.fnAddSupplier($scope.supplierInfo);
                }
            }
        ])
        .controller('SupplierEditCtrl', [
            '$scope',
            'SupplierService',
            '$filter',
            'dialogs',
            function ($scope, SupplierService, $filter, dialogs) {

                $scope.supplierInfo = {};

                var supplierId = $scope.$stateParams.supplierId;

                SupplierService.fnGetSuppliers().then(function (r) {
                    var suppliersInfo = $filter('filter')(r, {id: supplierId});
                    angular.forEach(suppliersInfo, function (value, key) {
                        //所有的suppliers中取出id为supplierId的一条数据
                        if(value.id == supplierId) {
                            $scope.supplierInfo = value;
                            return false;
                        }
                    });

                    //没有这个supplier
                    if(angular.equals({}, $scope.supplierInfo)) {
                        dialogs.error('Error', '未找到该supplier', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.supplier.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditSupplier = function () {
                    SupplierService.fnEditSupplier($scope.supplierInfo);
                }
            }
        ]);
})(angular);