/**
 * Created by geekzwb on 2016/12/22.
 * 域名管理
 * 不使用ng-table的分页
 */
;(function (angular) {
    'use strict';
    
    angular.module('WebsiteDashboard', [])
        .service('WebsiteService', [
            '$http',
            '$q',
            'CommonService',
            '$timeout',
            'ServerService',
            'CountryService',
            'BrandService',
            'AdStatusService',
            'WebsiteStatusService',
            'HostService',
            function ($http, $q, CommonService, $timeout, ServerService, CountryService, BrandService, AdStatusService, WebsiteStatusService, HostService) {
                var me = this;
                //me.usersOptional = [{id:1,title:'1'},{id:2,title:'2'},{id:3,title:'3'},{id:4,title:'4'},{id:5,title:'5'}]; ng-table 要这种格式，id与title
                //=================相关数据
                ServerService.fnGetServers().then(function (r) {
                    me.domainServers = r;
                });
                CountryService.fnGetCountries().then(function (r) {
                    me.domainCountries = r;
                });
                BrandService.fnGetBrands().then(function (r) {
                    me.domainBrands = r;
                });
                AdStatusService.fnGetAdStatuses().then(function (r) {
                    me.domainAdStatuses = r;
                });
                WebsiteStatusService.fnGetWebsiteStatuses().then(function (r) {
                    me.domainWebsiteStatuses = r;
                });
                CommonService.fnGetusersOptional().then(function (r) {
                    me.usersOptional = r.data;
                });
                HostService.fnGetHosts().then(function (r) {
                   me.domainHosts = r;
                });

                /**
                 * 网站分页数据
                 * @param searchRemoteInfo currentPage:当前页 itemsPerPage:每页多少
                 * @param params ng-table的params,非必须
                 */
                me.fnGetWebsites = function (searchRemoteInfo, params) {
                    //params.page() * params.count()
                    //console.log(params.sorting());
                    searchRemoteInfo.orderBy = params.orderBy();
                    params.count(searchRemoteInfo.itemsPerPage);

                    var deffered = $q.defer();

                    //先去除为空的字段
                    angular.forEach(searchRemoteInfo, function (value, key) {
                        if (value == null) delete searchRemoteInfo[key];
                    });

                    //=========================== search
                    $http.post("/website/index", searchRemoteInfo).then(function (r) {
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

                me.fnGetwebsiteById = function (id) {
                   return $http.get('/website/' + id + '/edit');
                };

                //新增
                me.fnAddWebsite = function (website) {
                    if(website.pending) return;
                    website.pending =true;
                    $http.post('/website', website)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                website.addStatus = true;
                                me.websitesInfo = {};//reload
                                $timeout(function () {
                                    website.addStatus = null;
                                }, 2000);
                            } else {
                                website.addStatus = false;
                            }
                        }, function (e) {
                            website.addStatus = false;
                        })
                        .finally(function () {
                            website.pending = false;
                        })
                };

                //edit 修改
                me.fnEditWebsite = function (websiteInfo) {
                    if(websiteInfo.pending) return;
                    websiteInfo.pending =true;
                    $http.put('/website/'+websiteInfo.id, websiteInfo)
                        .then(function (r) {
                            if(r.data.status == 1) {
                                websiteInfo.editStatus = true;
                                me.websitesInfo = {};//reload
                                $timeout(function () {
                                    websiteInfo.editStatus = null;
                                }, 2000);
                            } else {
                                websiteInfo.editStatus = false;
                            }
                        }, function (e) {
                            websiteInfo.editStatus = false;
                        })
                        .finally(function () {
                            websiteInfo.pending = false;
                        });
                };

                //删除
                me.fnDestroyWebsite = function (id, deleteAction) {
                    if(deleteAction.pending) return; //正在删除
                    deleteAction.pending =true;
                    $http.delete('/website/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                me.websitesInfo = {}; //reload：本地循环还是服务器remote重新拉取？
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
        .controller('WebsiteIndexCtrl', [
            '$scope',
            'WebsiteService',
            'NgTableParams',
            'dialogs',
            function ($scope, WebsiteService, NgTableParams, dialogs) {

                var getType = 'cache';// 每次去拉取posts的方式: cache or remote

                var self = this;

                self.WebsiteSer = WebsiteService;

                self.filterValue ='';

                self.deleteAction = {};//删除的状态 pendding 和 status

                self.searchRemoteInfo = {};
                self.searchRemoteInfo.maxSize = 5;
                self.searchRemoteInfo.totalItems = 100;
                self.searchRemoteInfo.currentPage = 1;
                //self.searchRemoteInfo.numPages
                self.searchRemoteInfo.itemsPerPage = 10;
                $scope.itemsPerPage = self.searchRemoteInfo.itemsPerPage;

                self.$injet = ["NgTableParams", "ngTableSimpleList"];

                self.tableParams = createUsingFullOptions();

                // init
                function createUsingFullOptions() {
                    var initialParams = {
                        //page: 1,
                        sorting: { id: "desc" },
                        count: self.searchRemoteInfo.itemsPerPage
                    };
                    var initialSettings = {
                        counts: [],
                        getData: function(params) {
                            return WebsiteService.fnGetWebsites(self.searchRemoteInfo,  params);
                        }
                    };
                    return new NgTableParams(initialParams, initialSettings);
                }

                //缓存筛选
                self.fnSearchChange = function () {
                    self.tableParams.reload();
                };

                //服务器筛选
                self.searchRemote = false;
                self.toggleSearch = function () {
                    self.searchRemote = !self.searchRemote;
                    if(self.searchRemote) {
                        self.searchRemoteInfo.isSearchRemote = true;
                    } else {
                        self.searchRemoteInfo.isSearchRemote = false;
                        self.tableParams.page(1);
                        self.tableParams.reload();
                    }
                };
                self.fnSearchRemote = function () {
                    self.tableParams.reload();
                };

                //去到第几页
                self.fnSetPage = function (pageNo) {
                    console.log(pageNo);
                    self.searchRemoteInfo.currentPage = pageNo;
                    self.tableParams.reload();
                };

                //每页显示几条
                $scope.$watch('itemsPerPage', function (newValue, oldValue) {
                    self.searchRemoteInfo.itemsPerPage = newValue;
                    self.tableParams.reload();
                });

                //当前页数已经改变
                self.fnPageChanged = function() {
                    console.log('Page changed to: ' + self.searchRemoteInfo.currentPage);
                    self.tableParams.reload();
                };

                //确认删除模态框
                var dlg = null;
                self.fnDestoryPost = function (id) {
                    dlg = dialogs.confirm('Confirm','确定要删除该域名吗?',{size: 'sm'});
                    dlg.result.then(function(btn){
                        //确认删除
                        WebsiteService.fnDestroyWebsite(id, self.deleteAction);
                        getType = 'remote';
                        self.tableParams.reload().finally(function () {
                            getType = 'cache';
                        });//更新表格，重新拉取数据
                    },function(btn){
                        console.log('取消删除website');
                    });
                };

            }])
        .controller('WebsiteAddCtrl', [
            '$scope',
            'WebsiteService',
            function ($scope, WebsiteService) {
                $scope.websiteInfo = {};
                $scope.WebsiteSer = WebsiteService;
                $scope.fnAddWebsite = function () {
                    WebsiteService.fnAddWebsite($scope.websiteInfo);
                }
            }
        ])
        .controller('WebsiteEditCtrl', [
            '$scope',
            'WebsiteService',
            '$filter',
            'dialogs',
            function ($scope, WebsiteService, $filter, dialogs) {

                $scope.websiteInfo = {};
                $scope.WebsiteSer = WebsiteService;

                var websiteId = $scope.$stateParams.websiteId;

                WebsiteService.fnGetwebsiteById(websiteId).then(function (r) {
                    $scope.websiteInfo = r.data.data;
                    //没有这个website
                    if(angular.equals(null, $scope.websiteInfo)) {
                        dialogs.error('Error', '未找到该域名', {size:'sm'}).result.then(function (btn) {
                            $scope.$state.go('website.website.index');
                        });
                    }
                });

                //提交修改
                $scope.fnEditWebsite = function () {
                    WebsiteService.fnEditWebsite($scope.websiteInfo);
                }
            }
        ]);
})(angular);