(function (angular) {
    
    'use strict';
    
    angular.module('DeliveryDepartmentDashboard', [])
        .service('DeliveryDepartmentService', [
            '$http',
            '$q',
            'OrderCommonService',
            'BrandService',
            function ($http, $q, OrderCommonService, BrandService) {
                var me = this;

                //表格顶部筛选
                me.arrOrderStatuses = [];//[{id:1, title:"已付款"}]
                me.arrOrderPayAfterStatuses = [];//[{id:1, title:"已付款"}]
                me.arrOrderCategories = [];//
                me.arrExpresses = [];//
                me.arrBrands = [];//品牌搜索
                //订单状态
                OrderCommonService.fnGetOrderStatuses().then(function (r) {
                    me.orderStatuses = r.data;
                    angular.forEach(me.orderStatuses, function(value) {
                        var temp = {};
                        temp.title = value.name;
                        temp.id = value.id;
                        me.arrOrderStatuses.push(temp);
                    })
                });
                //品牌
                BrandService.fnGetBrands().then(function (r) {
                    var brands = r;
                    angular.forEach(brands, function(value) {
                        var temp = {};
                        temp.title = value.name;
                        temp.id = value.id;
                        me.arrBrands.push(temp);
                    })
                });
                //发货等状态
                OrderCommonService.fnGetOrderPayAfterStatuses().then(function (r) {
                    me.payAfterStatuses = r.data;
                    angular.forEach(me.payAfterStatuses, function(value) {
                        var temp = {};
                        temp.title = value.name;
                        temp.name = value.name;
                        temp.id = value.id;
                        me.arrOrderPayAfterStatuses.push(temp);
                    })
                });

                /*============产品分类*/
                me.orderCategories = [];
                me.fnGetOrderCategories = function () {
                    return OrderCommonService.fnGetOrderCategories().then(function (r) {
                        me.orderCategories = r.data;
                        angular.forEach(me.orderCategories, function(value) {
                            var temp = {};
                            temp.title = value.name;
                            temp.name = value.name;
                            temp.id = value.id;
                            me.arrOrderCategories.push(temp);
                        });
                        me.orderCategories.unshift({id:0, name:'未分配'});
                        return r;
                    });
                };
                me.fnGetOrderCategories();

                /*============货运方式*/
                me.expresses = [];
                me.fnGetExpresses = function () {
                    return OrderCommonService.fnGetExpresses().then(function (r) {
                        me.expresses = r.data;
                        angular.forEach(me.expresses, function(value) {
                            var temp = {};
                            temp.title = value.name;
                            temp.name = value.name;
                            temp.id = value.id;
                            me.arrExpresses.push(temp);
                        });
                        me.expresses.unshift({id:0, name:'未分配'});
                        return r;
                    });
                };
                me.fnGetExpresses();

                //===========订单信息
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
                    $http.post("deliveryDepartment/order", searchRemoteInfo).then(function (r) {
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
                 * 将订单产品添加到发货分组
                 * @param product
                 */
                me.addProductsToShippingGroup = function (product) {
                    return $http.post('/productsToShippingGroup', product);
                };

                me.fnAddShippingGroup = function (shippingGroup) {
                    return $http.post('/shippingGroup', shippingGroup);
                };


                //导出DHL
                me.fnExportDHL = function(filters) {
                    return $http.post('deliveryDepartment/exportDHL', {filters:filters},{responseType: 'arraybuffer'}).success(function (data) {
                        var blob = new Blob([data], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                        var objectUrl = URL.createObjectURL(blob);
                        window.open(objectUrl);
                    });
                }
            }
        ])
        
        //
        .controller('DeliveryDepartmentIndexCtrl', [
            '$scope',
            'NgTableParams',
            'dialogs',
            'DeliveryDepartmentService',
            '$http',
            'ShippingGroupService',
            function ($scope, NgTableParams, dialogs, DeliveryDepartmentService, $http, ShippingGroupService) {
                var self = this;
                self.DeliverySer = DeliveryDepartmentService;

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
                            var data = DeliveryDepartmentService.fnGetOrders(self.searchRemoteInfo,  params);
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
                    self.searchRemoteInfo.currentPage = pageNo;
                    self.tableParams.reload();
                };
                //当前页数已经改变
                self.fnPageChanged = function() {
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
                    $http.post('customerService/ordersUpdate', ordersChanged).then(function (r) {
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

                /*===================start 发货分组相关操作*/
                self.shippingGroups = [];
                self.isCheckedAbled = false; //不可选

                var currentTime = new Date();

                var curMonth = (Array(2).join('0') + (currentTime.getMonth()+1)).slice(-2);
                var curDate = (Array(2).join('0') + currentTime.getDate()).slice(-2);

                self.currentShippingGroup = {
                    id: 0,
                    name: currentTime.getFullYear() + '' + curMonth + '' + curDate
                };
                ShippingGroupService.fnGetShippingGroups().then(function (r) {
                    self.shippingGroups = r;
                    self.shippingGroups.unshift({id:0, name:'未分配'});
                });

                //是否已经分配发货分组
                self.isShippingGroupChecked = function (product) {
                    if (product.shipping_group_id == 0) return false;
                    return true;
                };

                //将商品添加进发货分组
                self.addProductsToShippingGroup = function (product) {
                    if (product.shipping_group_id == 0 && self.currentShippingGroup.id == 0) {
                        dialogs.notify('Local Warn', '当前没有选择分组，请新增或选择！');
                        return false;
                    }
                    if(product.shipping_group_id != 0) product.shipping_group_id = 0;//已经选择则从分组移除
                    else product.shipping_group_id = self.currentShippingGroup.id; //添加进分组
                    
                    DeliveryDepartmentService.addProductsToShippingGroup(product).then(function (r) {
                        if (r.data.status != 1) {
                            dialogs.error('Server Error', '添加进分组失败，请重试！');
                        }
                    });
                };

                //选择发货分组
                self.fnSelectShippingGroup = function () {
                    self.currentShippingGroup.id = self.shippingGroupSelect.id;
                    self.currentShippingGroup.name = self.shippingGroupSelect.name;
                    self.isCheckedAbled = true;//checkbox可选择的
                };

                //新增发货分组
                self.fnAddShippingGroup = function () {
                    var cShippingGroup = {};
                    cShippingGroup.name = self.currentShippingGroup.name;
                    DeliveryDepartmentService.fnAddShippingGroup(cShippingGroup).then(function (r) {
                        if(r.data.status != 1) {
                            dialogs.error('Server error', "新增发货分组失败，请重试");
                            return;
                        }
                        //返回新增的id赋予给当前的
                        self.currentShippingGroup.id = r.data.id;

                        self.isCheckedAbled = true;//checkbox可选择的

                        //更新发货分组的缓存
                        ShippingGroupService.fnGetShippingGroups('remote').then(function (r) {
                            self.shippingGroups = r;
                        });

                        dialogs.notify("提示", "新增发货分组成功，现在您可以将产品直接勾选进该分组了", {'size': 'sm'})
                    })
                };
                /*===================end 发货分组相关操作*/

                /*====================start DHL??????*/
                self.fnExportDHL = function () {
                    var filters = self.tableParams.filter();
                    DeliveryDepartmentService.fnExportDHL(filters);
                };
            }
        ]);
    
})(angular);
