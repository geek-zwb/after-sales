/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('BrandDashboard', [])
        .service('BrandService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.brandsInfo = {};
                me.fnGetBrands = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.brandsInfo) || type == 'remote') {
                        $http.get("/brand").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.brandsInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.brandsInfo.data,filterValue);

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
                me.fnAddBrand = function (brand) {
                    if(brand.pending) return;
                    brand.pending =true;
                    $http.post('/brand', brand)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                brand.addStatus = true;
                                me.brandsInfo = {};//reload
                                $timeout(function () {
                                    brand.addStatus = null;
                                }, 2000);
                            } else {
                                brand.addStatus = false;
                            }
                        }, function (e) {
                            brand.addStatus = false;
                        })
                        .finally(function () {
                            brand.pending = false;
                        })
                };

                //edit 修改
                me.fnEditBrand = function (brandInfo) {
                    if(brandInfo.pending) return;
                    brandInfo.pending =true;
                    $http.put('/brand/'+brandInfo.id, brandInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                brandInfo.editStatus = true;
                                me.brandsInfo = {};//reload
                                $timeout(function () {
                                    brandInfo.editStatus = null;
                                }, 2000);
                            } else {
                                brandInfo.editStatus = false;
                            }
                        }, function (e) {
                            brandInfo.editStatus = false;
                        })
                        .finally(function () {
                            brandInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyBrand = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/brand/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.brandsInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('BrandIndexCtrl', [
            'BrandService',
            'NgTableParams',
            'dialogs',
            function (BrandService, NgTableParams, dialogs) {

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
                            return BrandService.fnGetBrands(self.filterValue, params, getType);
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
                        BrandService.fnDestroyBrand(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除brand');
                    });
                }

            }])
        .controller('BrandAddCtrl', [
            '$scope',
            'BrandService',
            function ($scope, BrandService) {
                $scope.brandInfo = {};

                $scope.fnAddBrand = function () {
                    BrandService.fnAddBrand($scope.brandInfo);
                }
            }
        ])
        .controller('BrandEditCtrl', [
            '$scope',
            'BrandService',
            '$filter',
            'dialogs',
            function ($scope, BrandService, $filter, dialogs) {

                $scope.brandInfo = {};

                var brandId = $scope.$stateParams.brandId;

                BrandService.fnGetBrands().then(function (r) {
                    var brandsInfo = $filter('filter')(r, {id: brandId});
                    angular.forEach(brandsInfo, function (value, key) {
                        //所有的brands中取出id为postId的一条数据
                        if(value.id == brandId) {
                            $scope.brandInfo = value;
                            return false;
                        }
                    });

                    //没有这个brand
                    if(angular.equals({}, $scope.brandInfo)) {
                        dialogs.error('Error', '未找到该品牌', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.brand.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditBrand = function () {
                    BrandService.fnEditBrand($scope.brandInfo);
                }
            }
        ]);
})(angular);