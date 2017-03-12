/**
 * Created by geekzwb on 2016/12/17.
 */
;(function (angular) {
    'use strict';

    angular.module('leavesDashboard', [])
        .service('LeaveRecordsService', [
            '$http',
            '$q',
            function ($http, $q) {
                var me = this;

                me.leavesRecords = {};
                me.fnGetLeavesRecords = function (currentMonth) {
                    var deffered = $q.defer();
                    if(angular.isUndefined(me.leavesRecords[currentMonth])) {
                        $http.get('/leave/monthLeaves/'+currentMonth).then(function (r) {
                            if (r.data.status == 1) {
                                me.leavesRecords[currentMonth] = r.data.data;
                                deffered.resolve(r.data.data);
                            } else {
                                deffered.reject();
                            }
                        });
                        return deffered.promise;
                    } else {
                        return $q.when(me.leavesRecords[currentMonth]);
                    }
                }
            }
        ])
        .controller('LeaveRecordsController', [
            '$scope',
            'LeaveRecordsService',
            '$filter',
            function ($scope, LeaveRecordsService, $filter) {
                var date = new Date();

                $scope.search = {
                    currentMonth: date.getFullYear() + '-' + (date.getMonth()+1),
                    searchKeys:''
                };

                var monthReg = /^(\d{4})\-(\d{2})$/;

                $scope.fnGetLeavesRecords = function (currentMonth) {
                    if(!monthReg.test(currentMonth)) {
                        $scope.search.status = false;
                        return;
                    }
                    LeaveRecordsService.fnGetLeavesRecords(currentMonth).then(function (r) {
                        $scope.leavesRecords = $filter('filter')(r,$scope.search.searchKeys);
                        $scope.search.status = true;
                    });
                };

                //init
                 $scope.fnGetLeavesRecords($scope.search.currentMonth);
            }
        ])
})(angular);
