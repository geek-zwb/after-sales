/**
 * Created by geekzwb on 2017/1/19.
 */
;(function (angular) {

    'use strict';

    angular.module('OrderCommonServiceDashboard', [])
        .service('OrderCommonService', [
            '$http',
            '$q',
            function ($http, $q) {
                var me = this;
                var orderStatuses = null;
                var orderPayAfterStatuses  = null;
                var suppliers = null;

                //付款前状态
                me.fnGetOrderStatuses = function () {
                    var defered = $q.defer();
                    if (angular.equals(null, orderStatuses)) {
                        var pendding = false;
                        if (!pendding) {
                            pendding = true;
                            $http.get('orderStatus').then(function (r) {
                                if (r.data.status !=1) {
                                    return defered.reject('server error');
                                }

                                orderStatuses = r.data.data;
                                defered.resolve(orderStatuses);

                            }).finally(function () {
                                pendding = false;
                            });
                        }

                        return defered.promise;

                    } else {
                        //console.log('orderStatuses', orderStatuses);
                       return $q.when(orderStatuses);
                    }
                };

                //获取付款后状态
                me.fnGetOrderPayAfterStatuses = function () {
                    if (angular.equals(null, orderPayAfterStatuses)) {
                        var defered = $q.defer();
                        var pendding = false;
                        if (!pendding) {
                            pendding = true;
                            $http.get('orderPayAfterStatus').then(function (r) {
                                if (r.data.status !=1) {
                                    return defered.reject('server error');
                                }

                                orderPayAfterStatuses = r.data.data;
                                defered.resolve(orderPayAfterStatuses);

                            }).finally(function () {
                                pendding = false;
                            });
                        }

                        return defered.promise;

                    } else {
                        return $q.when(orderPayAfterStatuses);
                    }
                };

                //获取供应商
                me.fnGetSuppliers = function () {
                    if (angular.equals(null, suppliers)) {
                        var defered = $q.defer();
                        var pendding = false;
                        if (!pendding) {
                            pendding = true;
                            $http.get('supplier').then(function (r) {
                                if (r.data.status !=1) {
                                    return defered.reject('server error');
                                }

                                suppliers = r.data.data;
                                defered.resolve(suppliers);

                            }).finally(function () {
                                pendding = false;
                            });
                        }

                        return defered.promise;

                    } else {
                        return $q.when(suppliers);
                    }
                };

                //获取产品分类
                var orderCategories = null;
                me.fnGetOrderCategories = function () {
                    if (angular.equals(null, orderCategories)) {
                        var defered = $q.defer();
                        var pendding = false;
                        if (!pendding) {
                            pendding = true;
                            $http.get('orderCategory').then(function (r) {
                                if (r.data.status !=1) {
                                    return defered.reject('server error');
                                }

                                orderCategories = r.data.data;
                                defered.resolve(orderCategories);

                            }).finally(function () {
                                pendding = false;
                            });
                        }

                        return defered.promise;

                    } else {
                        return $q.when(orderCategories);
                    }
                };

                //获取供应商
                var expresses = null;
                me.fnGetExpresses = function () {
                    if (angular.equals(null, expresses)) {
                        var defered = $q.defer();
                        var pendding = false;
                        if (!pendding) {
                            pendding = true;
                            $http.get('express').then(function (r) {
                                if (r.data.status !=1) {
                                    return defered.reject('server error');
                                }

                                expresses = r.data.data;
                                defered.resolve(expresses);

                            }).finally(function () {
                                pendding = false;
                            });
                        }

                        return defered.promise;

                    } else {
                        return $q.when(expresses);
                    }
                };
            }
        ])
})(angular);