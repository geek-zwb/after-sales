/**
 * Created by Geek-zwb on 2016/12/5 0005.
 */
(function () {

        'use strict';

        angular.module('postDashboard',[])
            .service('PostService',[
                '$http',
                '$q',
                '$filter',
                'CommonService',
                function ($http, $q, $filter, CommonService) {
                    var me = this;
                    me.postsInfo = {};//{recordTotal:*, data}

                    function filterData(data, filter){
                        return $filter('filter')(data, filter);
                    }

                    //all
                    me.fnGetPosts = function (filterValue, params, type) {
                        type = type || 'cache';//cache or remote
                        var deffered = $q.defer();
                        if(angular.equals({}, me.postsInfo) || type == 'remote') {
                            $http.get("/post/index").then(function (r) {

                                if(r.status !== 200 || r.data.status !=1) {
                                    deffered.reject();
                                    return;
                                }

                                me.postsInfo = r.data.data;

                                if(angular.isUndefined(params)) {
                                    var filteredData = filterData(me.postsInfo.data,filterValue);
                                    deffered.resolve(filteredData);
                                    return;
                                }
                                params.total(r.data.data.recordsTotal);
                                //var transformedData = sliceData(orderData(r.data.data.data,params),params);
                                var transformedData = CommonService.transformData(me.postsInfo.data, filterValue, params);
                                deffered.resolve(transformedData);
                            });

                            return deffered.promise;

                        } else {
                            
                            var filteredData = filterData(me.postsInfo.data,filterValue);

                            //!ng-table
                            if(angular.isUndefined(params)) {
                                return $q.when(filteredData);
                            }

                            params.total(filteredData.length);
                            var transformedData = CommonService.sliceOrderData(filteredData,params);
                            return $q.when(transformedData);
                        }
                    };
                    me.fnSearchPosts = function () {

                    };

                    // by id
                    me.fnGetPost = function (id) {

                    };

                    //新增
                    me.fnAddPost = function (postInfo) {
                        if(postInfo.pending) return;
                        postInfo.pending =true;
                        $http.post('/post', postInfo)
                            .then(function (r) {
                                if(r.data.status == 1) {
                                    postInfo.addStatus = true;
                                    me.postsInfo = {};//reload
                                } else {
                                    postInfo.addStatus = false;
                                }
                            }, function (e) {
                                postInfo.addStatus = false;
                            })
                            .finally(function () {
                                postInfo.pending = false;
                            })
                    };

                    //edit 修改
                    me.fnEditPost = function (postInfo) {
                        if(postInfo.pending) return;
                        postInfo.pending =true;
                        $http.put('/post/'+postInfo.id, postInfo)
                            .then(function (r) {
                                if(r.data.status == 1) {
                                    postInfo.editStatus = true;
                                    me.postsInfo = {};//reload
                                } else {
                                    postInfo.editStatus = false;
                                }
                            }, function (e) {
                                postInfo.editStatus = false;
                            })
                            .finally(function () {
                                postInfo.pending = false;
                            });
                    };

                    //删除
                    me.fnDestroyPost = function (id, deleteAction) {
                        if(deleteAction.pending) return; //正在删除
                        deleteAction.pending =true;
                        $http.delete('post/'+id).then(function (r) {
                            if(r.data.status == 1) {
                                deleteAction.status = true; //成功

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

            .controller('PostTimelineCtrl',[
                '$scope',
                'PostService',
                function ($scope, PostService) {
                    if(angular.equals({}, PostService.postsInfo)) {
                        PostService.fnGetPosts().then(function (postsInfo) {
                            $scope.posts = postsInfo;
                        });
                    } else {
                        $scope.posts = PostService.postsInfo.data;
                    }

                    //筛选
                    $scope.$watch("filterValue",function (newValue, oldValue) {
                        PostService.fnGetPosts(newValue).then(function (postsInfo) {
                            $scope.posts = postsInfo;
                        });
                    });
                }
            ])
            
            .controller('PostDescriptionCtrl', [
                '$scope',
                'PostService',
                '$filter',
                function ($scope, PostService, $filter) {
                    var postId = $scope.$stateParams.postId;
                    var posts = null;
                    var current;
                    if(angular.equals({}, PostService.postsInfo)) {
                        PostService.fnGetPosts().then(function (postsInfo) {
                            posts = $filter('filter')(postsInfo, {id:postId});
                            filterPosts(posts); //get $scope.post
                            current = postsInfo.indexOf($scope.post);
                            $scope.prePost = postsInfo.slice(current-1, current)[0];
                            $scope.nextPost = postsInfo.slice(current+1, current+2)[0];
                        });
                    } else {
                        posts = $filter('filter')(PostService.postsInfo.data, {id:postId});
                        filterPosts(posts);
                        current = PostService.postsInfo.data.indexOf($scope.post);
                        $scope.prePost = PostService.postsInfo.data.slice(current-1, current)[0];
                        $scope.nextPost = PostService.postsInfo.data.slice(current+1, current+2)[0];
                    }

                    function filterPosts(posts) {
                        angular.forEach(posts, function (value,key) {
                            if(value.id == postId) {
                                $scope.post = value;
                            }
                        });
                    }

                }
            ])

            .controller('PostManageIndexCtrl', [
                '$scope',
                'PostService',
                'NgTableParams',
                'dialogs',
                function ($scope, PostService, NgTableParams, dialogs) {

                    var getType = 'cache';// 每次去拉取posts的方式: cache or remote

                    var self = this;

                    self.deleteAction = {};//删除的状态 pendding 和 status

                    self.$injet = ["NgTableParams", "ngTableSimpleList"];

                    self.tableParams = createUsingFullOptions();

                    /*self.cols = [
                        // { field: "title", title: "标题", sortable: "title", filter: {title: "text"}, show: true },
                        { field: "title", title: "标题", sortable: "title", show: true },
                        { field: "created_at", title: "添加时间", sortable: "created_at", show: true },
                        { field: "updated_at", title: "最后修改时间", show: true },
                        {
                            field: 'id',
                            title: "操作",
                            show: true
                        }
                    ];
                    // 使用这种方式需要使用ng-table-dynamic="posts.tableParams with posts.cols"方式，详情参考官网ng-table.com
                    */

                    // init
                    function createUsingFullOptions() {
                        var initialParams = {
                            page: 1,
                            sorting: { created_at: "desc" },
                            count:5
                        };
                        var initialSettings = {
                            counts: [5, 20, 50, 100],
                            paginationMaxBlocks: 5,
                            paginationMinBlocks: 2,
                            getData: function(params) {
                                return PostService.fnGetPosts($scope.filterValue, params, getType);
                            }
                        };
                        return new NgTableParams(initialParams, initialSettings);
                    }

                    //筛选
                    $scope.$watch("filterValue", function () {
                        self.tableParams.reload();
                    });

                    //确认删除模态框
                    var dlg = null;
                    self.fnConfirmDestory = function (id) {
                       dlg = dialogs.confirm('Confirm','确定要删除该post吗?',{size: 'sm'});
                        dlg.result.then(function(btn){
                            //确认删除
                            PostService.fnDestroyPost(id, self.deleteAction);
                            getType = 'remote';
                            self.tableParams.reload();//更新表格，重新拉取数据
                            getType = 'cache';
                        },function(btn){
                            console.log('取消删除post');
                        });
                    }

                }])

            .controller('PostManageAddCtrl', [
                '$scope',
                'PostService',
                'textAngularManager',
                function ($scope, PostService, textAngularManager) {
                    $scope.postInfo = {};
                     $scope.postInfo.description = '<p>内容</p>';
                    $scope.disabled = false;
                    $scope.fnAddPost = function (postInfo) {
                        PostService.fnAddPost(postInfo);
                    }
                }
            ])

            .controller('PostManageEditCtrl', [
                '$scope',
                'PostService',
                '$filter',
                function ($scope, PostService, $filter) {
                    $scope.postInfo = {};

                    var postId = $scope.$stateParams.postId;
                    if(angular.equals({}, PostService.postsInfo.data)) {
                        $scope.$state.go('post.postManageIndex');
                        return;
                    }
                    var postsInfo = $filter('filter')(PostService.postsInfo.data, {id: postId});
                    angular.forEach(postsInfo, function (value, key) {
                        //所有的posts中取出id为postId的一条数据
                        if(value.id == postId) {
                            $scope.postInfo = value;
                            return false;
                        }
                    });
                    //没有这个post
                    if(angular.equals({}, $scope.postInfo)) {
                        $scope.$state.go('post.postManageIndex');
                        return;
                    }

                    //提交修改
                    $scope.fnEditPost = function (postInfo) {
                        PostService.fnEditPost(postInfo);
                    }
                }
            ]);
    
})();
