/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('MallPayTypeDashboard', [])
        .service('MallPayTypeService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.mallPayTypesInfo = {};
                me.fnGetMallPayTypes = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote
                    var deffered = $q.defer();

                    if(angular.equals({}, me.mallPayTypesInfo) || type == 'remote') {
                        $http.get("/mallPayType").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }
                            me.mallPayTypesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.mallPayTypesInfo.data,filterValue);

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
                me.fnAddMallPayType = function (mallPayType) {
                    if(mallPayType.pending) return;
                    mallPayType.pending =true;
                    $http.post('/mallPayType', mallPayType)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                mallPayType.addMallPayType = true;
                                me.mallPayTypesInfo = {};//reload
                                $timeout(function () {
                                    mallPayType.addMallPayType = null;
                                }, 2000);
                            } else {
                                mallPayType.addMallPayType = false;
                            }
                        }, function (e) {
                            mallPayType.addMallPayType = false;
                        })
                        .finally(function () {
                            mallPayType.pending = false;
                        })
                };

                //edit 修改
                me.fnEditMallPayType= function (mallPayTypeInfo) {
                    if(mallPayTypeInfo.pending) return;
                    mallPayTypeInfo.pending =true;
                    $http.put('/mallPayType/'+mallPayTypeInfo.id, mallPayTypeInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                mallPayTypeInfo.editMallPayType = true;
                                me.mallPayTypesInfo = {};//reload
                                $timeout(function () {
                                    mallPayTypeInfo.editMallPayType = null;
                                }, 2000);
                            } else {
                                mallPayTypeInfo.editMallPayType = false;
                            }
                        }, function (e) {
                            mallPayTypeInfo.editMallPayType = false;
                        })
                        .finally(function () {
                            mallPayTypeInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyMallPayTypes = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/mallPayType/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.mallPayTypesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('MallPayTypeIndexCtrl', [
            'MallPayTypeService',
            'NgTableParams',
            'dialogs',
            function (MallPayTypeService, NgTableParams, dialogs) {

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
                        sorting: { id: "desc" }
                    };
                    var initialSettings = {
                        getData: function(params) {
                            return MallPayTypeService.fnGetMallPayTypes(self.filterValue, params, getType);
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
                    dlg = dialogs.confirm('Confirm','确定要删除该付款方式吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        MallPayTypeService.fnDestroyMallPayTypes(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除付款方式');
                    });
                }

            }])
        .controller('MallPayTypeAddCtrl', [
            '$scope',
            'MallPayTypeService',
            function ($scope, MallPayTypeService) {
                
                $scope.mallPayTypeInfo = {};

                $scope.fnAddMallPayType = function () {
                    MallPayTypeService.fnAddMallPayType($scope.mallPayTypeInfo);
                }
            }
        ])
        .controller('MallPayTypeEditCtrl', [
            '$scope',
            'MallPayTypeService',
            '$filter',
            'dialogs',
            function ($scope, MallPayTypeService, $filter, dialogs) {

                $scope.mallPayTypeInfo = {};
                var mallPayTypeId = $scope.$stateParams.mallPayTypeId;


                MallPayTypeService.fnGetMallPayTypes().then(function (r) {
                    var mallPayTypesInfo = $filter('filter')(r, {id: mallPayTypeId});
                    angular.forEach(mallPayTypesInfo, function (value, key) {
                        //所有的mallPayTypes中取出id为postId的一条数据
                        if(value.id == mallPayTypeId) {
                            $scope.mallPayTypeInfo = value;
                            return false;
                        }
                    });
                    //没有这个mallPayType
                    if(angular.equals({}, $scope.mallPayTypeInfo)) {
                        dialogs.error('Error', '未找到该状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('mall.mallPayType.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditMallPayType = function () {
                    MallPayTypeService.fnEditMallPayType($scope.mallPayTypeInfo);
                }
            }
        ]);
})(angular);