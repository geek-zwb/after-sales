(function (angular) {
    
    'use strict';
    
    angular.module('ServiceDepartmentDashboard', [])
        .service('ServiceDepartmentService', [
            '$http',
            '$q',
            function ($http, $q) {
                var me = this;
                
                me.fnGetOrders = function (searchRemoteInfo, params) {

                    searchRemoteInfo.orderBy = params.orderBy();
                    console.log(params.orderBy());
                    params.count(searchRemoteInfo.itemsPerPage);
                    
                    var deffered = $q.defer();

                    //先去除为空的字段
                    angular.forEach(searchRemoteInfo, function (value, key) {
                        if (value == null) delete searchRemoteInfo[key];
                    });

                    //=========================== search
                    $http.post("customerService/order", searchRemoteInfo).then(function (r) {
                        if(r.data.status != 1) {
                            deffered.reject();
                            return;
                        }
                        //params.total(r.data.data.recordsTotal); no need ng-table with pagination
                        searchRemoteInfo.totalItems = r.data.data.recordsTotal;
                        deffered.resolve(r.data.data.data);
                    });
                    return deffered.promise;
                }
            }
        ])
        
        //
        .controller('ServiceDepartmentIndexCtrl', [
            '$scope',
            'NgTableParams',
            'dialogs',
            'ServiceDepartmentService',
            function ($scope, NgTableParams, dialogs, ServiceDepartmentService) {
                var self = this;

                self.searchRemoteInfo = {};
                self.searchRemoteInfo.totalItems = 100;
                self.searchRemoteInfo.currentPage = 1;
                //self.searchRemoteInfo.numPages
                self.searchRemoteInfo.itemsPerPage = 10;
                $scope.itemsPerPage = self.searchRemoteInfo.itemsPerPage;

                // init
                self.tableParams = createUsingFullOptions();
                function createUsingFullOptions() {
                    var initialParams = {
                        //page: 1,
                        sorting: { id: "desc" },
                        count: self.searchRemoteInfo.itemsPerPage
                    };
                    var initialSettings = {
                        counts: [],
                        getData: function(params) {
                            return ServiceDepartmentService.fnGetOrders(self.searchRemoteInfo,  params);
                        }
                    };
                    return new NgTableParams(initialParams, initialSettings);
                }

                //去到第几页
                self.fnSetPage = function (pageNo) {
                    console.log(pageNo);
                    self.searchRemoteInfo.currentPage = pageNo;
                    self.tableParams.reload();
                };

                //每页显示几条
                self.fnSetItemsPerPage = function (itemsPerPage) {
                    self.searchRemoteInfo.itemsPerPage = itemsPerPage;
                    self.tableParams.reload();
                };
            }
        ]);
    
})(angular);
