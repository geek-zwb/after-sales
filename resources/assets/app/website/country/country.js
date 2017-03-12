/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('CountryDashboard', [])
        .service('CountryService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.currencies = [
                    {currencyId:1, currencyName:'美元'},
                    {currencyId:2, currencyName:'欧元'},
                    {currencyId:3, currencyName:'英镑'},
                    {currencyId:4, currencyName:'加元'},
                    {currencyId:5, currencyName:'澳元'},
                    {currencyId:6, currencyName:'人民币'},
                    {currencyId:8, currencyName:'克朗'},
                    {currencyId:9, currencyName:'新加坡币'},
                    {currencyId:10, currencyName:'日元'},
                    {currencyId:11, currencyName:'韩元'}
                ];
                me.countriesInfo = {};
                me.fnGetCountries = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.countriesInfo) || type == 'remote') {
                        $http.get("/country").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.countriesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.countriesInfo.data,filterValue);

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
                me.fnAddCountry = function (country) {
                    if(country.pending) return;
                    country.pending =true;
                    $http.post('/country', country)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                country.addStatus = true;
                                me.countriesInfo = {};//reload
                                $timeout(function () {
                                    country.addStatus = null;
                                }, 2000);
                            } else {
                                country.addStatus = false;
                            }
                        }, function (e) {
                            country.addStatus = false;
                        })
                        .finally(function () {
                            country.pending = false;
                        })
                };

                //edit 修改
                me.fnEditCountry = function (countryInfo) {
                    if(countryInfo.pending) return;
                    countryInfo.pending =true;
                    $http.put('/country/'+countryInfo.id, countryInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                countryInfo.editStatus = true;
                                me.countriesInfo = {};//reload
                                $timeout(function () {
                                    countryInfo.editStatus = null;
                                }, 2000);
                            } else {
                                countryInfo.editStatus = false;
                            }
                        }, function (e) {
                            countryInfo.editStatus = false;
                        })
                        .finally(function () {
                            countryInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyCountry = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/country/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.countriesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('CountryIndexCtrl', [
            'CountryService',
            'NgTableParams',
            'dialogs',
            function (CountryService, NgTableParams, dialogs) {

                var getType = 'cache';// 每次去拉取posts的方式: cache or remote

                var self = this;

                self.currencies = CountryService.currencies;

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
                            return CountryService.fnGetCountries(self.filterValue, params, getType);
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
                        CountryService.fnDestroyCountry(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除country');
                    });
                }

            }])
        .controller('CountryAddCtrl', [
            '$scope',
            'CountryService',
            function ($scope, CountryService) {
                $scope.countryInfo = {};
                $scope.currencies = CountryService.currencies;
                $scope.fnAddCountry = function () {
                    CountryService.fnAddCountry($scope.countryInfo);
                }
            }
        ])
        .controller('CountryEditCtrl', [
            '$scope',
            'CountryService',
            '$filter',
            'dialogs',
            function ($scope, CountryService, $filter, dialogs) {

                $scope.countryInfo = {};
                $scope.currencies = CountryService.currencies;

                var countryId = $scope.$stateParams.countryId;

                CountryService.fnGetCountries().then(function (r) {
                    var countriesInfo = $filter('filter')(r, {id: countryId});
                    angular.forEach(countriesInfo, function (value, key) {
                        //所有的countrys中取出id为postId的一条数据
                        if(value.id == countryId) {
                            $scope.countryInfo = value;
                            return false;
                        }
                    });

                    //没有这个country
                    if(angular.equals({}, $scope.countryInfo)) {
                        dialogs.error('Error', '未找到该服务器', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.country.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditCountry = function () {
                    CountryService.fnEditCountry($scope.countryInfo);
                }
            }
        ]);
})(angular);