/**
 * Created by summer on 2017/3/22.
 */
;(function () {
    'use strict';
    angular.module('infoDashboard', [])
        .service('InfoService', InfoService)
        .controller('InfoIndexCtrl', InfoIndexCtrl);

    InfoService.$inject = ['$http', '$q'];
    InfoIndexCtrl.$inject = ['$scope', 'NgTableParams', 'dialogs', '$http', 'InfoService'];

    function InfoService($http, $q) {
        var me = this;

        me.fnGetInfos = function (searchRemoteInfo, params) {
            searchRemoteInfo.orderBy = params.orderBy();
            searchRemoteInfo.filters = params.filter();
            params.count(searchRemoteInfo.itemsPerPage);

            var deffered = $q.defer();

            //先去除为空的字段
            angular.forEach(searchRemoteInfo, function (value, key) {
                if (value == null) delete searchRemoteInfo[key];
            });

            //=========================== search
            $http.post("info/index", searchRemoteInfo).then(function (r) {
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

    function InfoIndexCtrl ($scope, NgTableParams, dialogs, $http, InfoService) {
        
        var vm = this;

        vm.searchRemoteInfo = {};
        vm.searchRemoteInfo.totalItems = 50;
        vm.searchRemoteInfo.currentPage = 1;
        //vm.searchRemoteInfo.numPages
        vm.searchRemoteInfo.itemsPerPage = 10;
        $scope.itemsPerPage = vm.searchRemoteInfo.itemsPerPage;

        var originalData = null;

        // init
        vm.tableParams = createUsingFullOptions();
        function createUsingFullOptions() {
            var initialParams = {
                //page: 1,
                sorting: { id: "desc" },
                count: vm.searchRemoteInfo.itemsPerPage
            };
            var initialSettings = {
                counts: [],
                getData: function(params) {
                    var data = InfoService.fnGetInfos(vm.searchRemoteInfo,  params);
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
        vm.fnSetPage = function (pageNo) {
            console.log(pageNo);
            vm.searchRemoteInfo.currentPage = pageNo;
            vm.tableParams.reload();
        };
        //当前页数已经改变
        vm.fnPageChanged = function() {
            console.log('Page changed to: ' + vm.searchRemoteInfo.currentPage);
            vm.tableParams.reload();
        };
        //每页显示几条
        vm.fnSetItemsPerPage = function (itemsPerPage) {
            vm.searchRemoteInfo.itemsPerPage = itemsPerPage;
            vm.tableParams.reload();
        };


        /*=============edit batch============*/
        vm.deleteCount = 0;
        //vm.add = add;
        vm.cancelChanges = cancelChanges;
        //vm.del = del;
        vm.hasChanges = hasChanges;
        vm.saveChanges = saveChanges;

        //////////

        /* function add() {
         vm.isEditing = true;
         vm.isAdding = true;
         vm.tableParams.settings().dataset.unshift({
         name: "",
         age: null,
         money: null
         });
         // we need to ensure the user sees the new row we've just added.
         // it seems a poor but reliable choice to remove sorting and move them to the first page
         // where we know that our new item was added to
         vm.tableParams.sorting({});
         vm.tableParams.page(1);
         vm.tableParams.reload();
         }*/

        function cancelChanges() {
            resetTableStatus();
            var currentPage = vm.tableParams.page();

            /*vm.tableParams.settings({
             dataset: angular.copy(originalData)
             });*/
            //vm.tableParams.reload();

            // keep the user on the current page when we can
            if (!vm.isAdding) {
                vm.tableParams.page(currentPage);
            }
        }

        function hasChanges() {
            return vm.tableForm.$dirty || vm.deleteCount > 0
        }

        function resetTableStatus() {
            vm.isEditing = false;
            vm.isAdding = false;
            vm.deleteCount = 0;
            vm.tableTracker.reset();
            vm.tableForm.$setPristine();
        }

        function saveChanges() {
            resetTableStatus();
            var currentPage = vm.tableParams.page();
            var infosChanged = compareData(vm.tableParams.data, originalData);
            $http.post('info/infosUpdate', infosChanged).then(function (r) {
                if (r.data.status == 1) {
                    originalData = angular.copy(vm.tableParams.data);
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
    }
})();