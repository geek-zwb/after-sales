/**
 * Created by Geek-zwb on 2016/12/2 0002.
 */

"use strict";
orderApp.config([
    "$stateProvider",
    "$urlRouterProvider",
    function ($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl:'./tpl/page/home.html'
            })
            .state('user', {
                abstract: true,
                url: '/user',
                templateUrl:'./tpl/user/base.html'
            })
            .state('user.info', {
                url:'/info',
                templateUrl:'./tpl/user/index.html'
            })
            .state('user.profileUpdate', {
                url:'/profileUpdate',
                templateUrl:'./tpl/user/profileUpdate.html'
            })
            .state('user.askForLeave', {
                url:'/askForLeave',
                templateUrl:'./tpl/user/askForLeave.html'
            })
            .state('user.allLeaves', {
                url: '/allLeaves',
                templateUrl: './tpl/user/allLeaves.html',
                controller:'GetLeavesController',
                controllerAs:'leave'
            })
            .state('manager', {
                url: '/manager',
                templateUrl: './tpl/manager/base.html',
                resolve:{
                    loadOut:["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load("managerDashboard");
                    }]
                }
            })
            .state('manager.staff', {
                abstract: true,
                template:'<div ui-view></div>'
            })
            .state('manager.staff.index', {
                url: '/index',
                templateUrl: './tpl/manager/staff/staffIndex.html',
                controller: 'StaffInfoCtrl',
                controllerAs: 'staffs'
            })
            .state('manager.staff.addStaff', {
                url: '/addStaff',
                templateUrl: './tpl/manager/staff/addStaff.html',
                controller: 'AddStaffCtrl'
            })
            .state('manager.staff.editStaff', {
                url: '/editStaff/:staffId',
                templateUrl: './tpl/manager/staff/editStaff.html',
                controller: 'EditStaffCtrl'
            })
            .state('manager.group', {
                abstract: true,
                template:'<div ui-view></div>'
            })
            .state('manager.group.index', {
                url: '/groupIndex',
                templateUrl: './tpl/manager/group/groupIndex.html',
                controller: 'GroupInfoCtrl'
            })
            .state('manager.group.addGroup', {
                url: '/addGroup',
                templateUrl: './tpl/manager/group/addGroup.html',
                controller: 'AddGroupCtrl'
            })
            .state('manager.group.editGroup', {
                url: '/editGroup/:groupId',
                templateUrl: './tpl/manager/group/editGroup.html',
                controller: 'EditGroupCtrl'
            })
            .state('manager.permission', {
                abstract: true,
                template:'<div ui-view></div>'
            })
            .state('manager.permission.index', {
                url: '/permissionIndex',
                templateUrl: './tpl/manager/permission/permissionIndex.html',
                controller: 'PermissionInfoCtrl'
            })
            .state('manager.permission.addPermission', {
                url: '/addPermission',
                templateUrl: './tpl/manager/permission/addPermission.html',
                controller: 'AddPermissionCtrl'
            })
            .state('manager.permission.editPermission', {
                url: '/editPermission/:permissionId',
                templateUrl: './tpl/manager/permission/editPermission.html',
                controller: 'EditPermissionCtrl'
            })

        //post
            .state('post', {
                url:'/post',
                templateUrl: './tpl/post/base.html',
                resolve:{
                    loadDashboard:["$ocLazyLoad", function ($ocLazyLoad) {
                        return $ocLazyLoad.load("postDashboard");
                    }]
                }
            })
            .state('post.postIndex', {
                url: '/postIndex',
                templateUrl: './tpl/post/postIndex.html',
                controller: 'PostTimelineCtrl'
            })
            .state('post.postDescription', {
                url: '/postDescription/:postId',
                templateUrl: './tpl/post/postDescription.html',
                controller: 'PostDescriptionCtrl'
            })
            .state('post.postManageIndex', {
                url: '/postManageIndex',
                templateUrl: './tpl/post/postManageIndex.html',
                controller: 'PostManageIndexCtrl',
                controllerAs: 'posts'
            })
            .state('post.postManageAdd', {
                url: '/postManageAdd',
                templateUrl: './tpl/post/postManageAdd.html',
                controller: 'PostManageAddCtrl'
            })
            .state('post.postManageEdit', {
                url: '/postManageEdit/:postId',
                templateUrl: './tpl/post/postManageEdit.html',
                controller: 'PostManageEditCtrl'
            })
            .state('post.postManageDestroy', {
                url: '/postManageDestroy',
                templateUrl: './tpl/post/postManageDestroy.html',
                controller: 'PostManageDestroyCtrl'
            })

        //performance
            .state('user.performance', {
                url: '/performances',
                resolve:{
                  loadPerformanceCtrl: ["$ocLazyLoad", function ($ocLazyLoad) {
                      return $ocLazyLoad.load('/build/app/performance/performance.js');
                  }]
                },
                views: {
                    '': {
                        controller: 'PerformanceCtrl',
                        templateUrl: './tpl/user/performance.html'
                    }
                }
            })

        //所有员工请假记录
            .state('leaveRecords', {
                url: '/leaveRecords',
                templateUrl: './tpl/leaves/records.html',
                resolve: {
                    loadleaveRecordsDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/leaves/leaveRecords.js');
                    }]
                },
                controller: 'LeaveRecordsController'
            })

        //网站信息管理
            .state('website', {
                template:'<div ui-view=""></div>'
            })

            //server
            .state('website.server', {
                url:'/server',
                resolve: {
                    loadServerDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/server/server.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.server.index', {
                url:'/serverIndex',
                templateUrl: './tpl/website/server/index.html',
                controller: 'ServersIndexCtrl as servers'
            })
            .state('website.server.add', {
                url:'/serverAdd',
                templateUrl: './tpl/website/server/add.html',
                controller: 'ServerAddCtrl'
            })
            .state('website.server.edit', {
                url:'/serverEdit/:serverId',
                templateUrl: './tpl/website/server/edit.html',
                controller: 'ServerEditCtrl'
            })
            //country
            .state('website.country', {
                url:'/country',
                resolve: {
                    loadServerDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/country/country.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.country.index', {
                url:'/countryIndex',
                templateUrl: './tpl/website/country/index.html',
                controller: 'CountryIndexCtrl as countries'
            })
            .state('website.country.add', {
                url:'/countryAdd',
                templateUrl: './tpl/website/country/add.html',
                controller: 'CountryAddCtrl'
            })
            .state('website.country.edit', {
                url:'/countryEdit/:countryId',
                templateUrl: './tpl/website/country/edit.html',
                controller: 'CountryEditCtrl'
            })
            //brand
            .state('website.brand', {
                url:'/brand',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/brand/brand.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.brand.index', {
                url:'/brandIndex',
                templateUrl: './tpl/website/brand/index.html',
                controller: 'BrandIndexCtrl as brands'
            })
            .state('website.brand.add', {
                url:'/brandAdd',
                templateUrl: './tpl/website/brand/add.html',
                controller: 'BrandAddCtrl'
            })
            .state('website.brand.edit', {
                url:'/brandEdit/:brandId',
                templateUrl: './tpl/website/brand/edit.html',
                controller: 'BrandEditCtrl'
            })
            //ad status
            .state('website.adStatus', {
                url:'/adStatus',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/adStatus/adStatus.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.adStatus.index', {
                url:'/adStatusIndex',
                templateUrl: './tpl/website/adStatus/index.html',
                controller: 'AdStatusIndexCtrl as adStatuses'
            })
            .state('website.adStatus.add', {
                url:'/adStatusAdd',
                templateUrl: './tpl/website/adStatus/add.html',
                controller: 'AdStatusAddCtrl'
            })
            .state('website.adStatus.edit', {
                url:'/adStatusEdit/:adStatusId',
                templateUrl: './tpl/website/adStatus/edit.html',
                controller: 'AdStatusEditCtrl'
            })
            //website status
            .state('website.websiteStatus', {
                url:'/websiteStatus',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/websiteStatus/websiteStatus.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.websiteStatus.index', {
                url:'/websiteStatusIndex',
                templateUrl: './tpl/website/websiteStatus/index.html',
                controller: 'WebsiteStatusIndexCtrl as websiteStatuses'
            })
            .state('website.websiteStatus.add', {
                url:'/websiteStatusAdd',
                templateUrl: './tpl/website/websiteStatus/add.html',
                controller: 'WebsiteStatusAddCtrl'
            })
            .state('website.websiteStatus.edit', {
                url:'/websiteStatusEdit/:websiteStatusId',
                templateUrl: './tpl/website/websiteStatus/edit.html',
                controller: 'WebsiteStatusEditCtrl'
            })
            //host
            .state('website.host', {
                url:'/host',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/host/host.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.host.index', {
                url:'/hostIndex',
                templateUrl: './tpl/website/host/index.html',
                controller: 'HostIndexCtrl as hosts'
            })
            .state('website.host.add', {
                url:'/hostAdd',
                templateUrl: './tpl/website/host/add.html',
                controller: 'HostAddCtrl'
            })
            .state('website.host.edit', {
                url:'/hostEdit/:hostId',
                templateUrl: './tpl/website/host/edit.html',
                controller: 'HostEditCtrl'
            })
            //website 域名管理
            .state('website.website', {
                url:'/website',
                resolve: {
                    loadOtherDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/build/app/website/server/server.js',
                            '/build/app/website/host/host.js',
                            '/build/app/website/websiteStatus/websiteStatus.js',
                            '/build/app/website/adStatus/adStatus.js',
                            '/build/app/website/brand/brand.js',
                            '/build/app/website/country/country.js'
                        ]).then(function () {
                            return $ocLazyLoad.load('/build/app/website/website/website.js');
                        });
                    }],
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/website/website/website.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('website.website.index', {
                url:'/websiteIndex',
                templateUrl: './tpl/website/website/index.html',
                controller: 'WebsiteIndexCtrl as websites'
            })
            .state('website.website.add', {
                url:'/websiteAdd',
                templateUrl: './tpl/website/website/add.html',
                controller: 'WebsiteAddCtrl'
            })
            .state('website.website.edit', {
                url:'/websiteEdit/:websiteId',
                templateUrl: './tpl/website/website/edit.html',
                controller: 'WebsiteEditCtrl'
            })

            //店铺平台信息管理
            .state('mall', {
                template:'<div ui-view=""></div>'
            })

            //店铺管理
            .state('mall.mall', {
                url:'/mall',
                resolve: {
                    loadStatusDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/mall/mallStatus/mallStatus.js');
                    }],
                    loadMallDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/mall/mall/mall.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('mall.mall.index', {
                url:'/mallIndex',
                templateUrl: './tpl/mall/mall/index.html',
                controller: 'MallIndexCtrl as MallIndex'
            })
            .state('mall.mall.add', {
                url:'/mallAdd',
                templateUrl: './tpl/mall/mall/add.html',
                controller: 'MallAddCtrl'
            })
            .state('mall.mall.edit', {
                url:'/mallEdit/:mallId',
                templateUrl: './tpl/mall/mall/edit.html',
                controller: 'MallEditCtrl'
            })

            //店铺状态
            .state('mall.mallStatus', {
                url:'/mallStatus',
                resolve: {
                    loadServerDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/mall/mallStatus/mallStatus.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('mall.mallStatus.index', {
                url:'/mallStatusIndex',
                templateUrl: './tpl/mall/mallStatus/index.html',
                controller: 'MallStatusIndexCtrl as mallStatuses'
            })
            .state('mall.mallStatus.add', {
                url:'/mallStatusAdd',
                templateUrl: './tpl/mall/mallStatus/add.html',
                controller: 'MallStatusAddCtrl'
            })
            .state('mall.mallStatus.edit', {
                url:'/mallStatusEdit/:mallStatusId',
                templateUrl: './tpl/mall/mallStatus/edit.html',
                controller: 'MallStatusEditCtrl'
            })

            //店铺付款方式
            .state('mall.mallPayType', {
                url:'/mallPayType',
                resolve: {
                    loadServerDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/mall/mallPayType/mallPayType.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('mall.mallPayType.index', {
                url:'/mallPayTypeIndex',
                templateUrl: './tpl/mall/mallPayType/index.html',
                controller: 'MallPayTypeIndexCtrl as mallPayType'
            })
            .state('mall.mallPayType.add', {
                url:'/mallPayTypeAdd',
                templateUrl: './tpl/mall/mallPayType/add.html',
                controller: 'MallPayTypeAddCtrl'
            })
            .state('mall.mallPayType.edit', {
                url:'/mallPayTypeEdit/:mallPayTypeId',
                templateUrl: './tpl/mall/mallPayType/edit.html',
                controller: 'MallPayTypeEditCtrl'
            })
                
        //订单信息管理
            .state('order', {
                template:'<div ui-view=""></div>',
                resolve: {
                    loadOrderCommonService: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            '/build/app/common/directives/zwbMagnifyingGlass.js',
                            '/build/app/order/common/commonService.js',
                            '/build/app/website/brand/brand.js'
                        ]);
                    }]
                }
            })
            //order status 订单状态
            .state('order.orderStatus', {
                url:'/orderStatus',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/status/status.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.orderStatus.index', {
                url:'/orderStatusIndex',
                templateUrl: './tpl/order/status/index.html',
                controller: 'OrderStatusIndexCtrl as orderStatus'
            })
            .state('order.orderStatus.add', {
                url:'/orderStatusAdd',
                templateUrl: './tpl/order/status/add.html',
                controller: 'OrderStatusAddCtrl'
            })
            .state('order.orderStatus.edit', {
                url:'/orderStatusEdit/:orderStatusId',
                templateUrl: './tpl/order/status/edit.html',
                controller: 'OrderStatusEditCtrl'
            })
            //order status after pay 付款后订单状态
            .state('order.orderPayAfterStatus', {
                url:'/orderPayAfterStatus',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/orderPayAfterStatus/orderPayAfterStatus.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.orderPayAfterStatus.index', {
                url:'/orderPayAfterStatusIndex',
                templateUrl: './tpl/order/orderPayAfterStatus/index.html',
                controller: 'OrderPayAfterStatusIndexCtrl as orderPayAfterStatus'
            })
            .state('order.orderPayAfterStatus.add', {
                url:'/orderPayAfterStatusAdd',
                templateUrl: './tpl/order/orderPayAfterStatus/add.html',
                controller: 'OrderPayAfterStatusAddCtrl'
            })
            .state('order.orderPayAfterStatus.edit', {
                url:'/orderPayAfterStatusEdit/:orderPayAfterStatusId',
                templateUrl: './tpl/order/orderPayAfterStatus/edit.html',
                controller: 'OrderPayAfterStatusEditCtrl'
            })
            //express 货运方式
            .state('order.express', {
                url:'/express',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/express/express.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.express.index', {
                url:'/express',
                templateUrl: './tpl/order/express/index.html',
                controller: 'ExpressIndexCtrl as express'
            })
            .state('order.express.add', {
                url:'/expressAdd',
                templateUrl: './tpl/order/express/add.html',
                controller: 'ExpressAddCtrl'
            })
            .state('order.express.edit', {
                url:'/expressEdit/:expressId',
                templateUrl: './tpl/order/express/edit.html',
                controller: 'ExpressEditCtrl'
            })
            //快递发货公司
            .state('order.expressCompany', {
                url:'/expressCompany',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/expressCompany/expressCompany.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.expressCompany.index', {
                url:'/expressCompanyIndex',
                templateUrl: './tpl/order/expressCompany/index.html',
                controller: 'ExpressCompanyIndexCtrl as expressCompany'
            })
            .state('order.expressCompany.add', {
                url:'/expressCompanyAdd',
                templateUrl: './tpl/order/expressCompany/add.html',
                controller: 'ExpressCompanyAddCtrl'
            })
            .state('order.expressCompany.edit', {
                url:'/expressCompanyEdit/:expressCompanyId',
                templateUrl: './tpl/order/expressCompany/edit.html',
                controller: 'ExpressCompanyEditCtrl'
            })
            //客服部 订单相关
            .state('order.customerServiceDepartment', {
                url:'/customerServiceDepartment',
                resolve: {
                    loadBrandDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/customerServiceDepartment/customerServiceDepartment.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.customerServiceDepartment.index', {
                url: '/index',
                templateUrl: './tpl/order/customerService/index.html',
                controller: 'ServiceDepartmentIndexCtrl as serviceDepartment'
            })
            //订货部 订单相关
            .state('order.orderDepartment', {
                url:'/orderDepartment',
                resolve: {
                    loadpurchaseGroupDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/purchaseGroup/purchaseGroup.js');
                    }],
                    loadorderDepartmentDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/orderDepartment/orderDepartment.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.orderDepartment.index', {
                url: '/index',
                templateUrl: './tpl/order/orderDepartment/index.html',
                controller: 'OrderDepartmentIndexCtrl as orderDepartment'
            })
            //订货部 订货分组
            .state('order.purchaseGroup', {
                url:'/purchaseGroup',
                resolve: {
                    loadpurchaseGroupDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/purchaseGroup/purchaseGroup.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.purchaseGroup.index', {
                url: '/index',
                templateUrl: './tpl/order/purchaseGroup/index.html',
                controller: 'PurchaseGroupIndexCtrl as purchaseGroup'
            })
            .state('order.purchaseGroup.add', {
                url:'/purchaseGroupAdd',
                templateUrl: './tpl/order/purchaseGroup/add.html',
                controller: 'PurchaseGroupAddCtrl'
            })
            .state('order.purchaseGroup.edit', {
                url:'/purchaseGroupEdit/:purchaseGroupId',
                templateUrl: './tpl/order/purchaseGroup/edit.html',
                controller: 'PurchaseGroupEditCtrl'
            })
            .state('order.purchaseGroup.detail', {
                url:'/purchaseGroupDetail/:purchaseGroupId',
                templateUrl: './tpl/order/purchaseGroup/detail.html',
                controller: 'PurchaseGroupDetailCtrl'
            })
            //发货部 订单相关
            .state('order.deliveryDepartment', {
                url:'/deliveryDepartment',
                resolve: {
                    loadShippingGroupDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/shippingGroup/shippingGroup.js');
                    }],
                    loadDeliveryDepartmentDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/deliveryDepartment/deliveryDepartment.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.deliveryDepartment.index', {
                url: '/index',
                templateUrl: './tpl/order/deliveryDepartment/index.html',
                controller: 'DeliveryDepartmentIndexCtrl as deliveryDepartment'
            })
            //发货部 订单产品分类
            .state('order.orderCategory', {
                url:'/category',
                resolve: {
                    loadOrderCategoryDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/category/orderCategory.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.orderCategory.index', {
                url: '/index',
                templateUrl: './tpl/order/category/index.html',
                controller: 'OrderCategoryIndexCtrl as orderCategory'
            })
            .state('order.orderCategory.add', {
                url:'/categoryAdd',
                templateUrl: './tpl/order/category/add.html',
                controller: 'OrderCategoryAddCtrl'
            })
            .state('order.orderCategory.edit', {
                url:'/categoryEdit/:orderCategoryId',
                templateUrl: './tpl/order/category/edit.html',
                controller: 'OrderCategoryEditCtrl'
            })
            //发货部 发货分组
            .state('order.shippingGroup', {
                url:'/shippingGroup',
                resolve: {
                    loadShippingGroupDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/shippingGroup/shippingGroup.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.shippingGroup.index', {
                url: '/index',
                templateUrl: './tpl/order/shippingGroup/index.html',
                controller: 'ShippingGroupIndexCtrl as shippingGroup'
            })
            .state('order.shippingGroup.add', {
                url:'/shippingGroupAdd',
                templateUrl: './tpl/order/shippingGroup/add.html',
                controller: 'ShippingGroupAddCtrl'
            })
            .state('order.shippingGroup.edit', {
                url:'/shippingGroupEdit/:shippingGroupId',
                templateUrl: './tpl/order/shippingGroup/edit.html',
                controller: 'ShippingGroupEditCtrl'
            })
            //供应商
            .state('order.supplier', {
                url:'/supplier',
                resolve: {
                    loadSupplierDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/supplier/supplier.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.supplier.index', {
                url: '/index',
                templateUrl: './tpl/order/supplier/index.html',
                controller: 'SupplierIndexCtrl as supplier'
            })
            .state('order.supplier.add', {
                url:'/SupplierAdd',
                templateUrl: './tpl/order/supplier/add.html',
                controller: 'SupplierAddCtrl'
            })
            .state('order.supplier.edit', {
                url:'/supplierEdit/:supplierId',
                templateUrl: './tpl/order/supplier/edit.html',
                controller: 'SupplierEditCtrl'
            })
            //产品及库存
            .state('order.stock', {
                url:'/stock',
                resolve: {
                    loadSupplierDashboard: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/stock/stock.js');
                    }]
                },
                template: '<div ui-view=""></div>'
            })
            .state('order.stock.index', {
                url: '/index',
                templateUrl: './tpl/order/stock/index.html',
                controller: 'StockIndexCtrl as stock'
            })
        //订单详情
            .state('order.detail', {
                url: '/detail/index/:orderId',
                templateUrl: './tpl/order/detail/index.html',
                resolve: {
                    loadJs: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('/build/app/order/detail/detail.js');
                    }]
                },
                controller: 'OrderDetailController as orderDetail'
            })
    }
    ])
    .run([
        '$rootScope',
        '$state',
        '$stateParams',
        function($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);
