/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('ShippingGroupDashboard', [])
        .service('ShippingGroupService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.shippingGroupsInfo = {};
                me.fnGetShippingGroups = function (type, filterValue, params) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.shippingGroupsInfo) || type == 'remote') {
                        $http.get("/shippingGroup").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.shippingGroupsInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.shippingGroupsInfo.data,filterValue);

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
                me.fnAddShippingGroup = function (shippingGroup) {
                    if(shippingGroup.pending) return;
                    shippingGroup.pending =true;
                    $http.post('/shippingGroup', shippingGroup)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                shippingGroup.addStatus = true;
                                me.shippingGroupsInfo = {};//reload
                                $timeout(function () {
                                    shippingGroup.addStatus = null;
                                }, 2000);
                            } else {
                                shippingGroup.addStatus = false;
                            }
                        }, function (e) {
                            shippingGroup.addStatus = false;
                        })
                        .finally(function () {
                            shippingGroup.pending = false;
                        })
                };

                //edit 修改
                me.fnEditShippingGroup = function (shippingGroupInfo) {
                    if(shippingGroupInfo.pending) return;
                    shippingGroupInfo.pending =true;
                    $http.put('/shippingGroup/'+shippingGroupInfo.id, shippingGroupInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                shippingGroupInfo.editStatus = true;
                                me.shippingGroupsInfo = {};//reload
                                $timeout(function () {
                                    shippingGroupInfo.editStatus = null;
                                }, 2000);
                            } else {
                                shippingGroupInfo.editStatus = false;
                            }
                        }, function (e) {
                            shippingGroupInfo.editStatus = false;
                        })
                        .finally(function () {
                            shippingGroupInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyShippingGroup = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/shippingGroup/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.shippingGroupsInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('ShippingGroupIndexCtrl', [
            'ShippingGroupService',
            'NgTableParams',
            'dialogs',
            function (ShippingGroupService, NgTableParams, dialogs) {

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
                            return ShippingGroupService.fnGetShippingGroups(getType, self.filterValue, params);
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
                self.fnDestoryShippingGroup = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该shippingGroup吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        ShippingGroupService.fnDestroyShippingGroup(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除shippingGroup');
                    });
                }

            }])
        .controller('ShippingGroupAddCtrl', [
            '$scope',
            'ShippingGroupService',
            function ($scope, ShippingGroupService) {
                $scope.shippingGroupInfo = {};

                $scope.fnAddShippingGroup = function () {
                    ShippingGroupService.fnAddShippingGroup($scope.shippingGroupInfo);
                }
            }
        ])
        .controller('ShippingGroupEditCtrl', [
            '$scope',
            'ShippingGroupService',
            '$filter',
            'dialogs',
            function ($scope, ShippingGroupService, $filter, dialogs) {

                $scope.shippingGroupInfo = {};

                var shippingGroupId = $scope.$stateParams.shippingGroupId;

                ShippingGroupService.fnGetShippingGroups().then(function (r) {
                    var shippingGroupsInfo = $filter('filter')(r, {id: shippingGroupId});
                    angular.forEach(shippingGroupsInfo, function (value, key) {
                        //所有的shippingGroups中取出id为shippingGroupId的一条数据
                        if(value.id == shippingGroupId) {
                            $scope.shippingGroupInfo = value;
                            return false;
                        }
                    });

                    //没有这个shippingGroup
                    if(angular.equals({}, $scope.shippingGroupInfo)) {
                        dialogs.error('Error', '未找到该shippingGroup', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.shippingGroup.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditShippingGroup = function () {
                    ShippingGroupService.fnEditShippingGroup($scope.shippingGroupInfo);
                }
            }
        ]);
})(angular);