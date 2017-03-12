(function (angular) {
    
    'use strict';
    
    angular.module('OrderDepartmentDashboard', [])
        .service('OrderDepartmentService', [
            '$http',
            '$q',
            'OrderCommonService',
            function ($http, $q, OrderCommonService) {
                var me = this;

                //表格顶部筛选
                me.arrOrderStatuses = [];//[{id:1, title:"已付款"}]
                me.arrOrderPayAfterStatuses = [];//[{id:1, title:"已付款"}]
                //订单状态
                OrderCommonService.fnGetOrderStatuses().then(function (r) {
                    me.orderStatuses = r.data;
                    angular.forEach(me.orderStatuses, function(value) {
                        var status = {};
                        status.title = value.name;
                        status.id = value.id;
                        me.arrOrderStatuses.push(status);
                    })

                });
                //发货等状态
                OrderCommonService.fnGetOrderPayAfterStatuses().then(function (r) {
                    me.payAfterStatuses = r.data;
                    angular.forEach(me.payAfterStatuses, function(value) {
                        var status = {};
                        status.title = value.name;
                        status.id = value.id;
                        me.arrOrderPayAfterStatuses.push(status);
                    })
                });

                me.fnGetOrders = function (searchRemoteInfo, params) {

                    searchRemoteInfo.orderBy = params.orderBy();
                    searchRemoteInfo.filters = params.filter();
                    params.count(searchRemoteInfo.itemsPerPage);
                    
                    var deffered = $q.defer();

                    //先去除为空的字段
                    angular.forEach(searchRemoteInfo, function (value, key) {
                        if (value == null) delete searchRemoteInfo[key];
                    });

                    //=========================== search
                    $http.post("orderDepartment/order", searchRemoteInfo).then(function (r) {
                        if(r.data.status != 1) {
                            deffered.reject();
                            return;
                        }
                        //params.total(r.data.data.recordsTotal); no need ng-table with pagination
                        searchRemoteInfo.totalItems = r.data.data.recordsTotal;
                        deffered.resolve(r.data.data.data);
                    });
                    return deffered.promise;
                };

                /**
                 * 将订单产品添加到订货分组，修改采购价
                 * @param product
                 */
                me.addProductsToPurchaseGroup = function (product) {
                   return $http.post('productsToPurchaseGroup', product);
                };
                
                me.fnAddPurchaseGroup = function (purchaseGroup) {
                    return $http.post('/purchaseGroup', purchaseGroup);
                }
            }
        ])
        
        //
        .controller('OrderDepartmentIndexCtrl', [
            '$scope',
            'NgTableParams',
            'dialogs',
            'OrderDepartmentService',
            '$http',
            'PurchaseGroupService',
            function ($scope, NgTableParams, dialogs, OrderDepartmentService, $http, PurchaseGroupService) {
                var self = this;
                self.OrderDepartmentSer = OrderDepartmentService;

                self.searchRemoteInfo = {};
                self.searchRemoteInfo.totalItems = 100;
                self.searchRemoteInfo.currentPage = 1;
                //self.searchRemoteInfo.numPages
                self.searchRemoteInfo.itemsPerPage = 10;
                $scope.itemsPerPage = self.searchRemoteInfo.itemsPerPage;

                var originalData = null;

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
                            var data = OrderDepartmentService.fnGetOrders(self.searchRemoteInfo,  params);
                            data.then(function (r) {
                                originalData = angular.copy(r);//重新深拷贝一份出来，而不是赋值引用
                            });
                            return data;
                        }
                    };
                    return new NgTableParams(initialParams, initialSettings);
                }

                /*==================angular-bootstrap-ui 分页==================*/
                //去到第几页
                self.fnSetPage = function (pageNo) {
                    console.log(pageNo);
                    self.searchRemoteInfo.currentPage = pageNo;
                    self.tableParams.reload();
                };
                //当前页数已经改变
                self.fnPageChanged = function() {
                    console.log('Page changed to: ' + self.searchRemoteInfo.currentPage);
                    self.tableParams.reload();
                };
                //每页显示几条
                self.fnSetItemsPerPage = function (itemsPerPage) {
                    self.searchRemoteInfo.itemsPerPage = itemsPerPage;
                    self.tableParams.reload();
                };


                /*=============edit batch============*/
                self.deleteCount = 0;
                //self.add = add;
                self.cancelChanges = cancelChanges;
                //self.del = del;
                self.hasChanges = hasChanges;
                self.saveChanges = saveChanges;

                //////////

               /* function add() {
                    self.isEditing = true;
                    self.isAdding = true;
                    self.tableParams.settings().dataset.unshift({
                        name: "",
                        age: null,
                        money: null
                    });
                    // we need to ensure the user sees the new row we've just added.
                    // it seems a poor but reliable choice to remove sorting and move them to the first page
                    // where we know that our new item was added to
                    self.tableParams.sorting({});
                    self.tableParams.page(1);
                    self.tableParams.reload();
                }*/

                function cancelChanges() {
                    resetTableStatus();
                    var currentPage = self.tableParams.page();

                    /*self.tableParams.settings({
                        dataset: angular.copy(originalData)
                    });*/
                    //self.tableParams.reload();

                    // keep the user on the current page when we can
                    if (!self.isAdding) {
                        self.tableParams.page(currentPage);
                    }
                }

                function hasChanges() {
                    return self.tableForm.$dirty || self.deleteCount > 0
                }

                function resetTableStatus() {
                    self.isEditing = false;
                    self.isAdding = false;
                    self.deleteCount = 0;
                    self.tableTracker.reset();
                    self.tableForm.$setPristine();
                }

                function saveChanges() {
                    resetTableStatus();
                    var currentPage = self.tableParams.page();
                    var ordersChanged = compareData(self.tableParams.data, originalData);
                    $http.post('orderDepartment/ordersUpdate', ordersChanged).then(function (r) {
                        if (r.data.status == 1) {
                            originalData = angular.copy(self.tableParams.data);
                        }
                    })
                }

                /**
                 * 返回两个对象不同的值
                 * @param n
                 * @param o
                 * @returns {Array}
                 */
                function compareData(n, o) {
                    var diff = [];
                    angular.forEach(n, function (value, key) {
                        if (!angular.equals(value, o[key])) {
                            diff.push(value);
                        }
                    });
                    return diff;
                }

            //================采购分组相关操作
                self.purchaseGroups = [];
                self.isCheckedAbled = false; //不可选

                var currentTime = new Date();
                var curMonth = (Array(2).join('0') + (currentTime.getMonth()+1)).slice(-2);
                var curDate = (Array(2).join('0') + currentTime.getDate()).slice(-2);

                self.currentPurchaseGroup = {
                    id: 0,
                    name: currentTime.getFullYear() + '' + curMonth + '' + curDate
                };
                PurchaseGroupService.fnGetPurchaseGroups().then(function (r) {
                    self.purchaseGroups = r;
                });
                
                //
                self.isPurchaseGroupChecked = function (product) {
                    if (product.purchase_group_id == 0) return false;
                    return true;
                };

                //将商品添加进采购分组，或者修改采购价等
                self.addProductsToPurchaseGroup = function (product) {
                    if (product.purchase_group_id == 0 && self.currentPurchaseGroup.id == 0) {
                        dialogs.notify('Local Warn', '当前没有选择分组，请新增或选择！');
                        return false;
                    }
                    if(product.purchase_group_id != 0) product.purchase_group_id = 0;//已经选择则从分组移除
                    else product.purchase_group_id = self.currentPurchaseGroup.id; //添加进分组

                    OrderDepartmentService.addProductsToPurchaseGroup(product).then(function (r) {
                        if (r.data.status != 1) {
                            dialogs.error('Server Error', '添加进分组失败，请重试！');
                        }
                    });
                };

                //选择采购分组
                self.fnSelectPurchaseGroup = function () {
                    self.currentPurchaseGroup.id = self.purchaseGroupSelect.id;
                    self.currentPurchaseGroup.name = self.purchaseGroupSelect.name;
                    self.isCheckedAbled = true;//checkbox可选择的
                };

                //新增采购分组
                self.fnAddPurchaseGroup = function () {
                    var cPurchaseGroup = {};
                    cPurchaseGroup.name = self.currentPurchaseGroup.name;
                    OrderDepartmentService.fnAddPurchaseGroup(cPurchaseGroup).then(function (r) {
                        if(r.data.status != 1) {
                            dialogs.error('Server error', "新增采购分组失败，请重试");
                            return;
                        }
                        //返回新增的id赋予给当前的
                        self.currentPurchaseGroup.id = r.data.id;

                        self.isCheckedAbled = true;//checkbox可选择的

                        //更新采购分组的缓存
                        PurchaseGroupService.fnGetPurchaseGroups('remote').then(function (r) {
                            self.purchaseGroups = r;
                        });

                        dialogs.notify("提示", "新增采购分组成功，现在您可以将产品直接勾选进该分组了", {'size': 'sm'})
                    })
                }
            }
        ]);
    
})(angular);
