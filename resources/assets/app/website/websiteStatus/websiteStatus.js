/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('WebsiteStatusDashboard', [])
        .service('WebsiteStatusService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.websiteStatusesInfo = {};
                me.fnGetWebsiteStatuses = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();
                    if(angular.equals({}, me.websiteStatusesInfo) || type == 'remote') {
                        $http.get("/websiteStatus").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.websiteStatusesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.websiteStatusesInfo.data,filterValue);

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
                me.fnAddWebsiteStatus = function (websiteStatus) {
                    if(websiteStatus.pending) return;
                    websiteStatus.pending =true;
                    $http.post('/websiteStatus', websiteStatus)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                websiteStatus.addStatus = true;
                                me.websiteStatusesInfo = {};//reload
                                $timeout(function () {
                                    websiteStatus.addStatus = null;
                                }, 2000);
                            } else {
                                websiteStatus.addStatus = false;
                            }
                        }, function (e) {
                            websiteStatus.addStatus = false;
                        })
                        .finally(function () {
                            websiteStatus.pending = false;
                        })
                };

                //edit 修改
                me.fnEditWebsiteStatus = function (websiteStatusInfo) {
                    if(websiteStatusInfo.pending) return;
                    websiteStatusInfo.pending =true;
                    $http.put('/websiteStatus/'+websiteStatusInfo.id, websiteStatusInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                websiteStatusInfo.editStatus = true;
                                me.websiteStatusesInfo = {};//reload
                                $timeout(function () {
                                    websiteStatusInfo.editStatus = null;
                                }, 2000);
                            } else {
                                websiteStatusInfo.editStatus = false;
                            }
                        }, function (e) {
                            websiteStatusInfo.editStatus = false;
                        })
                        .finally(function () {
                            websiteStatusInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyWebsiteStatus = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/websiteStatus/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.websiteStatusesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('WebsiteStatusIndexCtrl', [
            'WebsiteStatusService',
            'NgTableParams',
            'dialogs',
            function (WebsiteStatusService, NgTableParams, dialogs) {

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
                            return WebsiteStatusService.fnGetWebsiteStatuses(self.filterValue, params, getType);
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
                        WebsiteStatusService.fnDestroyWebsiteStatus(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除websiteStatus');
                    });
                }

            }])
        .controller('WebsiteStatusAddCtrl', [
            '$scope',
            'WebsiteStatusService',
            function ($scope, WebsiteStatusService) {
                $scope.websiteStatusInfo = {};

                $scope.fnAddWebsiteStatus = function () {
                    WebsiteStatusService.fnAddWebsiteStatus($scope.websiteStatusInfo);
                }
            }
        ])
        .controller('WebsiteStatusEditCtrl', [
            '$scope',
            'WebsiteStatusService',
            '$filter',
            'dialogs',
            function ($scope, WebsiteStatusService, $filter, dialogs) {

                $scope.websiteStatusInfo = {};

                var websiteStatusId = $scope.$stateParams.websiteStatusId;

                WebsiteStatusService.fnGetWebsiteStatuses().then(function (r) {
                    var websiteStatusesInfo = $filter('filter')(r, {id: websiteStatusId});
                    angular.forEach(websiteStatusesInfo, function (value, key) {
                        //所有的websiteStatuses中取出id为postId的一条数据
                        if(value.id == websiteStatusId) {
                            $scope.websiteStatusInfo = value;
                            return false;
                        }
                    });

                    //没有这个websiteStatus
                    if(angular.equals({}, $scope.websiteStatusInfo)) {
                        dialogs.error('Error', '未找到该网站状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.websiteStatus.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditWebsiteStatus = function () {
                    WebsiteStatusService.fnEditWebsiteStatus($scope.websiteStatusInfo);
                }
            }
        ]);
})(angular);