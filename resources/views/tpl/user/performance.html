<section>
    <form class="form-inline" role="form">
        <div class="form-group">
            <label for="userName" class="control-label">执行人</label>
            <select ng-if="isSupervisor" class="form-control" ng-model="searchKeys.userId" ng-options="user.id as user.name for user in usersByGroup" ng-change="fnChangeUser(searchKeys.userId)"></select>
            <input ng-if="!isSupervisor" type="text" class="form-control" id="userName" name="userName" disabled placeholder="[: searchKeys.userName :]">
        </div>
        <div class="form-group">
            <label for="currentMonth" class="control-label">考核日期</label>
            <input class="form-control" ng-model="searchKeys.currentMonth"/>
        </div>
        <div class="form-group">
            <button class="btn btn-primary" ng-click="fnReloadPerformances()">submit</button>
        </div>
    </form>

        <table class="table table-condensed">
            <thead>
            <tr>
                <th width="6%">星期</th>
                <th width="8%">工作日期</th>
                <th width="36%">每日必要工作内容要点</th>
                <th width="6%">自我考评(0-10)</th>
                <th width="6%">完成效率(主管 0-10)</th>
                <th width="6%">质量分(主管 0-10)</th>
                <th width="6%">综合考评(主管 0-10)</th>
                <th width="26%">备注建议</th>
            </tr>
            </thead>
            <tbody>
            <tr ng-repeat="performance in performances">
                <td ng-if="!performance.week_target">[: performance.what_day :]</td>
                <td ng-if="!performance.week_target">[: performance.day_time :]</td>
                <td ng-if="!performance.week_target" ng-init="updateStatus={}">
                    <textarea ng-model="performance.day_work" style="width: 98%;"  rows="2" ng-blur="$parent.fnSetPerformance(performance, updateStatus)"></textarea>
                    <font ng-show="updateStatus.status" color="green">success</font>
                </td>
                <td ng-if="!performance.week_target" ng-init="updateStatus={}" >
                    <input style="height: 47px;width: 100%;" type="number" ng-model="performance.self_rating" ng-blur="$parent.fnSetPerformance(performance, updateStatus)">
                    <font ng-show="updateStatus.status" color="green">success</font>
                </td>
                <td ng-if="!performance.week_target" ng-init="updateStatus={}">
                    <input style="height: 47px;width: 100%;" type="number" ng-disabled="!isSupervisor" ng-model="performance.efficiency_rating" ng-blur="$parent.fnSetPerformance(performance, updateStatus)">
                    <font ng-show="updateStatus.status" color="green">success</font>
                </td>
                <td ng-if="!performance.week_target" ng-init="updateStatus={}">
                    <input style="height: 47px;width: 100%;" type="number" ng-disabled="!isSupervisor" ng-model="performance.quality_rating" ng-blur="$parent.fnSetPerformance(performance, updateStatus)">
                    <font ng-show="updateStatus.status" color="green">success</font>
                </td>
                <td ng-if="!performance.week_target" ng-init="updateStatus={}">
                    <input style="height: 47px;width: 100%;" type="number" ng-disabled="!isSupervisor" ng-model="performance.overall_rating" ng-blur="$parent.fnSetPerformance(performance, updateStatus)">
                    <font ng-show="updateStatus.status" color="green">success</font>
                </td>
                <td ng-if="!performance.week_target" ng-init="updateStatus={}"><textarea ng-disabled="!isSupervisor" style="width: 98%;" ng-model="performance.remark"  rows="2" ng-blur="$parent.fnSetPerformance(performance, updateStatus)"></textarea></td>
                <td colspan="3" ng-if="performance.week_target" ng-init="updateStatus={}"><textarea style="width: 98%;" ng-model="performance.week_target"  rows="2" ng-blur="$parent.fnSetPerformance(performance, updateStatus)"></textarea></td>
                <td colspan="5" ng-if="performance.week_completed_target" ng-init="updateStatus={}"><textarea style="width: 98%;" ng-model="performance.week_completed_target"  rows="2" ng-blur="$parent.fnSetPerformance(performance, updateStatus)"></textarea></td>
            </tr>
            </tbody>
        </table>

</section>