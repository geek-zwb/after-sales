/**
 * Created by geekzwb on 2016/12/19.
 */
;(function (angular) {
    'use strict';
    
    angular.module('OrderStatusDashboard', [])
        .service('OrderStatusService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            function ($http, $q, CommonService, $timeout) {
                var me = this;
                me.statusesInfo = {};
                me.fnGetOrderStatuses = function (filterValue, params, type) {
                    type = type || 'cache';//cache or remote

                    var deffered = $q.defer();

                    if(angular.equals({}, me.statusesInfo) || type == 'remote') {
                        $http.get("/orderStatus").then(function (r) {
                            if(r.data.status != 1) {
                                deffered.reject();
                                return;
                            }

                            me.statusesInfo = r.data.data;

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

                        var filteredData = CommonService.filterData(me.statusesInfo.data,filterValue);

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
                me.fnAddOrderStatus = function (status) {
                    if(status.pending) return;
                    status.pending =true;
                    $http.post('/orderStatus', status)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                status.addOrderStatus = true;
                                me.statusesInfo = {};//reload
                                $timeout(function () {
                                    status.addOrderStatus = null;
                                }, 2000);
                            } else {
                                status.addOrderStatus = false;
                            }
                        }, function (e) {
                            status.addOrderStatus = false;
                        })
                        .finally(function () {
                            status.pending = false;
                        })
                };

                //edit 修改
                me.fnEditOrderStatus = function (statusInfo) {
                    if(statusInfo.pending) return;
                    statusInfo.pending =true;
                    $http.put('/orderStatus/'+statusInfo.id, statusInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                statusInfo.editOrderStatus = true;
                                me.statusesInfo = {};//reload
                                $timeout(function () {
                                    statusInfo.editOrderStatus = null;
                                }, 2000);
                            } else {
                                statusInfo.editOrderStatus = false;
                            }
                        }, function (e) {
                            statusInfo.editOrderStatus = false;
                        })
                        .finally(function () {
                            statusInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyOrderStatus = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/orderStatus/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.statusesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('OrderStatusIndexCtrl', [
            'OrderStatusService',
            'NgTableParams',
            'dialogs',
            function (OrderStatusService, NgTableParams, dialogs) {

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
                            return OrderStatusService.fnGetOrderStatuses(self.filterValue, params, getType);
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
                        OrderStatusService.fnDestroyOrderStatus(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除status');
                    });
                }

            }])
        .controller('OrderStatusAddCtrl', [
            '$scope',
            'OrderStatusService',
            function ($scope, OrderStatusService) {

                //there has a test post
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/addorder/index',
                    data: {
                        //withCredentials: true,
                        websiteOrderId: '110001',
                        domain: 'www.geekzwb.com',
                        customerName: 'testname',
                        email: 'testemail@qq.com',
                        phone: 13720892502,
                        gender: 'm',
                        country: 'United States',
                        state: 'haiweiyi', //nullable
                        city: 'Guam',
                        street: 'street',
                        postcode: '360000',
                        price: '$970',
                        datePurchased: '2017-01-12 12:06:14',
                        payType: 'Myorderapproved',//Myorderapproved
                        payComments: 'TradeNo:YKF1701111406178142  ||BillNo:949010002  ||Amount:770.00USD ||errorMsg:Paid web site restrictions! ',
                        products: [
                            {
                                quantity: 5,
                                name: 'Supreme Box Logo Hooded Sweatshirt Pullover Black 001',
                                attributes: 'Size: M;Color:black',
                                sku: 'SUPERME0A004',
                                img: 'http://www.supremeussale.com/images/SUPREME0A004.jpg',
                                remark: '产品备注'//？订单产品表中的remark
                            },
                            {
                                quantity: 3,
                                name: 'Supreme Box Logo Crewneck Sweatshirt Pink',
                                attributes: 'Size: M',//用;隔开
                                sku: 'SUPREME0A019',
                                img: 'http://www.supremeussale.com/images/SUPREME0A019.jpg'
                            }
                        ]
                    },
                    success: function (data, status) {
                        console.log(data);
                    }
                });

                $scope.orderStatusInfo = {};

                $scope.fnAddOrderStatus = function () {
                    OrderStatusService.fnAddOrderStatus($scope.orderStatusInfo);
                }
            }
        ])
        .controller('OrderStatusEditCtrl', [
            '$scope',
            'OrderStatusService',
            '$filter',
            'dialogs',
            function ($scope, OrderStatusService, $filter, dialogs) {

                $scope.orderStatusInfo = {};

                var orderStatusId = $scope.$stateParams.orderStatusId;

                OrderStatusService.fnGetOrderStatuses().then(function (r) {
                    var statusesInfo = $filter('filter')(r, {id: orderStatusId});
                    angular.forEach(statusesInfo, function (value, key) {
                        //所有的statuses中取出id为postId的一条数据
                        if(value.id == orderStatusId) {
                            $scope.orderStatusInfo = value;
                            return false;
                        }
                    });

                    //没有这个status
                    if(angular.equals({}, $scope.statusInfo)) {
                        dialogs.error('Error', '未找到该状态', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('order.status.index');
                        });
                        return;
                    }
                });

                //提交修改
                $scope.fnEditOrderStatus = function () {
                    OrderStatusService.fnEditOrderStatus($scope.orderStatusInfo);
                }
            }
        ]);
})(angular);