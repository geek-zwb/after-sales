<section class="mt20">
    <div class="row" style="margin:5px;">
        <div class="col-sm-6 text-left">
            <div id="tags-table_filter" class="dataTables_filter search-box">
                <label>搜索:<input type="search" class="form-control input-sm" ng-model="MallIndex.filterValue" ng-change="MallIndex.fnSearchChange()"></label>
            </div>
        </div>
        <div class="col-sm-6 text-right">
            <div class="btn-group pull-right">
                <button class="btn btn-default" ng-if="MallIndex.isEditing" ng-click="MallIndex.cancelChanges()">
                    <span class="glyphicon glyphicon-remove"></span>
                </button>
                <button class="btn btn-primary" ng-if="!MallIndex.isEditing" ng-click="MallIndex.isEditing = true">
                    <span class="glyphicon glyphicon-pencil"></span>
                </button>
                <button class="btn btn-primary" ng-if="MallIndex.isEditing" ng-disabled="!MallIndex.hasChanges() || MallIndex.tableTracker.$invalid" ng-click="MallIndex.saveChanges()">
                    <span class="glyphicon glyphicon-ok"></span>
                </button>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12">
            <div class="box">
                <div class="box-body table-responsive">
                    <table  ng-table="MallIndex.tableParams" class="table table-bordered table-hover table-condensed editable-table"
                            ng-form="MallIndex.tableForm" disable-filter="MallIndex.isAdding" nbg-tracked-table="MallIndex.tableTracker">
                        <tr ng-repeat="row in $data" ng-form="rowForm" nbg-tracked-table-row="row">
                            <td data-title="'Id'" sortable="'id'" filter="{id: 'text'}">[: row.id :]</td>
                            <td data-title="'店铺名称'" filter="{name: 'text'}">[: row.name :]</td>
                            <td data-title="'网址'" filter="{website: 'text'}">[: row.website :]</td>
                            <td data-title="'用户名'" filter="{username: 'text'}">[: row.username :]</td>
                            <td data-title="'密码'" filter="{password: 'text'}">[: row.password :]</td>
                            <td title="'店铺状态'" filter="{mall_status_id: 'select'}" filter-data="MallIndex.mallService.arrmallStatuses" ng-switch="MallIndex.isEditing" ng-class="mall_status_id.$dirty ? 'bg-warning' : ''" ng-form="mall_status_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.mall_status_id | zwbIdToName:MallIndex.mallService.mallStatuses :]</span>
                                <div class="controls" ng-class="mall_status_id.$invalid && mall_status_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="mall_status_id" ng-model="row.mall_status_id"
                                            ng-options="mallStatuses.id as mallStatuses.name for mallStatuses in MallIndex.mallService.arrmallStatuses"></select>
                                </div>
                            </td>
                            <td title="'负责人'" filter="{user_id: 'select'}" filter-data="MallIndex.mallService.arrusersOptional" ng-switch="MallIndex.isEditing" ng-class="user_id.$dirty ? 'bg-warning' : ''" ng-form="user_id" nbg-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.user_id | zwbIdToName:MallIndex.mallService.usersOptional :]</span>
                                <div class="controls" ng-class="user_id.$invalid && user_id.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <select class="editable-input form-control input-sm" name="user_id" ng-model="row.user_id"
                                            ng-options="user.id as user.name for user in MallIndex.mallService.arrusersOptional"></select>
                                </div>
                            </td>
                            <td title="'备注'" filter="{remark: 'text'}" ng-switch="MallIndex.isEditing" ng-class="remark.$dirty ? 'bg-warning' : ''" ng-form="remark" demo-tracked-table-cell>
                                <span ng-switch-default class="editable-text">[: row.remark :]</span>
                                <div class="controls" ng-class="remark.$invalid && remark.$dirty ? 'has-error' : ''" ng-switch-when="true">
                                    <input type="text" name="remark" ng-model="row.remark" class="editable-input form-control input-sm" required />
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="box-body">
                    <div class="floatLeft">
                        <ul class="pagination-sm no-margin" previous-text="上一页" next-text="下一页" uib-pagination ng-change="MallIndex.fnPageChanged()" items-per-page="MallIndex.searchRemoteInfo.itemsPerPage" num-pages="MallIndex.searchRemoteInfo.numPages" total-items="MallIndex.searchRemoteInfo.totalItems" ng-model="MallIndex.searchRemoteInfo.currentPage" max-size="MallIndex.searchRemoteInfo.maxSize" boundary-link-numbers="true"></ul>
                    </div>
                    <div class="floatRight">
                        <div class="btn-group">
                            <label class="btn btn-default" ng-click="MallIndex.fnSetItemsPerPage(10)" ng-model="itemsPerPage" uib-btn-radio="10">10</label>
                            <label class="btn btn-default" ng-click="MallIndex.fnSetItemsPerPage(20)" ng-model="itemsPerPage" uib-btn-radio="20">20</label>
                            <label class="btn btn-default" ng-click="MallIndex.fnSetItemsPerPage(50)" ng-model="itemsPerPage" uib-btn-radio="50">50</label>
                            <label class="btn btn-default" ng-click="MallIndex.fnSetItemsPerPage(100)" ng-model="itemsPerPage" uib-btn-radio="100">100</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>